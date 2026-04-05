# **Hive**    

## **Hive伪分布式部署**

### **Hive的安装**

​	先确保Hadoop能正常启动。启动失败的，可以参考[Hadoop安装部署教程](https://www.kdocs.cn/l/cg0JtlQ5eQrz)。在使用`jps`查看进程的时候，发现缺失`DataNode`,可能是由于上次使用的时候没有停止Hadoop的使用，导致`DataNode`没有及时结束，系统误以为该进程仍在进行，可以使用`stop-all.sh`将Hadoop进行关闭，然后使用`start-all.sh`重新启动Hadoop；若仍未能成功，则先停止Hadoop的运行，找到Hadoop的data缓存文件，将其删除，重新启动Hadoop。

​	将准备好的软件包发送到 `/home/soft`目录下，并解压到目录`/opt` 。先转到Hive安装包所在位置`cd /home/soft`，然后使用解压命令`tar -zxvf apache-hive-2.3.9-bin.tar.gz -C /opt` 将Hive安装到`/opt` 目录下。使用`cd /opt`转到`/opt`目录，使用`mv apache-hive-2.3.9-bin/ hive-2.3.9`将`apache-hive-2.3.9-bin.tar.gz -C`重命名为`hive-2.3.9`，将目录名精简化，便于后续的使用。

​	配置Hive的环境变量。使用`vi /etc/profile`，在文件末尾分别增加

```
export HIVE_HOME=/opt/hive-2.3.9
export PATH=${HIVE_HOME}/bin:$PATH。
```

使用`source /etc/profile`保存profile文件，并使之生效。

​	配置 hive-env.sh。打开Hive的安装目录下的conf目录，使用命令`cd /opt/hive-2.3.9/conf/`，根据模板生成一个配置文件 hive-env.sh：`cp hive-env.sh.template hive-env.sh`，然后再配置 HADOOP_HOME 和 HIVE_CONF_DIR 到对应的目录，使用`vi hive-env.sh`后，在末尾添加：

```.sh
export HADOOP_HOME=/opt/hadoop-2.9.2
export HIVE_CONF_DIR=/opt/hive-2.3.9/conf
```

使用`source /etc/profile`保存，并使配置生效。

​	安装元数据库.Hive 高版本启动时，需要配置元数据库，如果采用其它数据库，请酌情替换对应步骤，这里采用 MYSQL 作为元数据库。先转换到opt目录：`cd /opt`，安装wget：`yum install wget `解决wget命令不存在。在线下载mysql安装包：`wget -i -c  http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm `，使用上面的命令就直接下载安装用的 Yum Repository，大概 25KB 的样子，然后就可以直接 yum 安装了:`yum -y install mysql57-community-release-el7-10.noarch.rpm`，开始安装 MySQL 服务器(可增加--nogpgcheck 选项跳过公钥检查):`yum install -y mysql-community-server --nogpgcheck`。

​	启动 MySQL:`systemctl start mysqld.service`，查看 MySQL启动状态:`systemctl status mysqld`。生成的随机密码：`grep "password" /var/log/mysqld.log`， “2024-06-11T01:39:18.959420Z 1 [Note] A temporary password is generated for root@localhost: !O+(lQVK8BC0”，默认生成的随机密码为"!O+(lQVK8BC0"。使用默认密码登录MySQL：`mysql -uroot -p' !O+(lQVK8BC0'`,修改mysql的登录密码：`ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root@123';`修改后的密码为Root@123。开启 mysql 的远程访问，执行以下命令开启远程访问限制如要开启所有的，用%代替 IP，否则将IP改成具体的IP地址：`grant all privileges on *.* to 'root'@'%' identified by 'Root@123' with grant option;`。然后分别输入` flush privileges`和` exit`。开启防火墙 mysql 3306 端口的外部访问：`firewall-cmd --zone=public --add-port=3306/tcp --permanent`，`firewall-cmd --reload`。设置 MySql 的相关参数，修改 /etc/my.cnf 并保存。使用`vi /etc/my.cnf`

```.cnf
# 设置忽略大小写，在[mysqld]节点下，加入：
lower_case_table_names=1
# 配置默认编码为 utf8,在[mysqld]节点下，加入：
character_set_server=utf8
init_connect='SET NAMES utf8'
```

重启 MySql 服务： `systemctl restart mysqld`，新建 Hive 元数据库，先登录`mysql -u root -p'Root@123'`。在MySQL中使用SQL命令：`create database metastore;`。

​	配置连接元数据库的驱动。先切换到/home/soft目录:`cd /home/soft`。使用wget命令在线下载安装包：`wget https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-java-5.1.49.tar.gz`。然后将其解压到/opt目录：`tar -zxvf mysql-connector-java-5.1.49.tar.gz -C /opt`，将解压出来的 mysql 驱动拷贝到 hive 的 lib 目录下，先进入所在目录：`cd /opt/mysql-connector-java-5.1.49/`，使用cp复制命令：`cp mysql-connector-java-5.1.49-bin.jar /opt/hive-2.3.9/lib/` 。

​	配置元数据库 Metastore(连接到 MySQL)。首先在$HIVE_HOME/conf 目录下新建 hive-site.xml 文件，`	`切换到$HIVE_HOME/conf 目录，编辑hive-site.xml文件：`vi hive-site.xml`

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
<!-- jdbc 连接的 URL -->
<property>
<name>javax.jdo.option.ConnectionURL</name>
    <!--tulip is hostname -->
<value>jdbc:mysql://tulip:3306/metastore?useSSL=false</value>
</property>
<!-- jdbc 连接的 Driver-->
<property>
<name>javax.jdo.option.ConnectionDriverName</name>
<value>com.mysql.jdbc.Driver</value>
</property>
<!-- jdbc 连接的 username-->
<property>
<name>javax.jdo.option.ConnectionUserName</name>
    <!-- root is mysql`s username-->
<value>root</value>
</property>
<!-- jdbc 连接的 password -->
<property>
<name>javax.jdo.option.ConnectionPassword</name>
    <!-- Root@123 is mysql`s password-->
<value>Root@123</value>
</property>
<!-- Hive 元数据存储版本的验证 -->
<property>
<name>hive.metastore.schema.verification</name>
<value>false</value>
</property>
<!--元数据存储授权-->
<property>
<name>hive.metastore.event.db.notification.api.auth</name>
<value>false</value>
</property>
<!-- Hive 默认在 HDFS 的工作目录 -->
<property>
<name>hive.metastore.warehouse.dir</name>
<value>/user/hive/warehouse</value>
</property>
<!-- 指定 hiveserver2 连接的 host -->
<property>
<name>hive.server2.thrift.bind.host</name>
<value>tulip</value>
</property>
<!-- 指定 hiveserver2 连接的端口号 -->
<property>
<name>hive.server2.thrift.port</name>
<value>10000</value>
</property>
<!-- 指定本地模式执行任务，提高性能 -->
<property>
<name>hive.exec.mode.local.auto</name>
<value>true</value>
</property>
</configuration>
```



​	初始化 Hive 元数据库。注意：只需要初始化一次。使用`schematool -initSchema -dbType mysql -verbose`。此步报错多为配置hive-env.sh时Hadoop的路径没有输入正确或hive-site.xml文件书写错误，可以通过Hadoop安装路径和检查hive-site.xml文件排除错误，hive-site.xml文件中一般不含中文，否则容易引起编码错误。还需注意一下，Hadoop的环境变量是否配好，Hadoop是否正常启动，进程是否齐全。

​	启动 Hive之前，先确保Hadoop已经正常启动。Hive是基于Hadoop开发的Java项目，在运行之前一定要确保配置好jdk和Hadoop。启动Hadoop：start-all.sh 。然后在 HDFS 上创建/tmp 和/user/hive/warehouse 两个目录并修改他们的同组权限可写(可选，一般能自动生成)：`hadoop fs -mkdir /tmp `，该目录若存在，则可以直接输入下一条命令：`hadoop fs -mkdir -p /user/hive/warehouse`。若显示没有权限，可以使用“hdfs dfsadmin safemode leave"命令解除安全限制。  “hadoop fs -chmod g+w /tmp ”“hadoop fs -chmod g+w /user/hive/warehouse”这两条命令为可选命令。确保元数据库 MYSQL 已正常启动，已启动则跳过：systemctl start mysqld，完成后输入`hive`启动。

​	使用Hive，Hive的多数命令与MySQL一致，可以直接使用。

```TE
hive> show databases;
hive> show tables;
hive> create table test (id int);
hive> insert into test values(1);
hive> select * from test;
```



## Hive的使用

安装后使用，先确保MySQL服务和Hadoop处于开启状态。

start-all.sh  # 开启Hadoop

systemctl start mysqld.service  # 启动MySQL服务

systemctl status mysqld  # 查看MySQL启动状态

完成以上操作后，输入 hive 启动Hive。

## Hive的内外部表

​	在启动Hive之前先启动Hadoop。Hive是基于 Hadoop 的一个数据仓库工具，利用 HDFS 存储数据，利用 MapReduce 查询分析数据。没有启动Hadoop ，Hive也不会成功启动。

| 操作        | 命令 |
| ---------------- |  ------------- |
| 启动Hadoop  |start-all.sh  |
| 启动Hive    | hive |
| 创建用户数据库 | CREATE DATABASE userdb; |
| 删除数据库 | DROP DATABASE IF EXISTS userdb; |

​	查看和管理数据库在hive命令行状态下，查看已有的数据库 ，然后重新启动一个远程终端，连接master节点，可以通过hadoop相关命令查看已经创建的userdb数据库，将来可以直接拷贝数据文件到hdfs的userdb目录下的相关表进行填充数据。

| 操作           | 命令            |
| -------------- | --------------- |
| 查看已有数据库 | show databases; |
| 查看Hadoop根目录  | hadoop fs -ls  /  |
| 查看user目录 | hadoop fs -ls /user |
| 查看hive目录 | hadoop fs -ls /user/hive |
| 查看数仓   | hadoop fs -ls /user/hive/warehouse/ |

​	删除数据库可以使用命令删除数据库：DROP DATABASE IF EXISTS userdb;

### 创建内部表

​	先切换当前数据库，使用use命令，使用create命令创建数据表。在元数据仓库中查看已有的内部表，如果hive安装部署时使用MySQL作为元数据仓库，可以通过MySQL客户端软件连接到MySQL数据库服务器，访问TBLS表，能看到已经创建好的数据表，并在TBL_TYPE列中能看到该表的类型为MANAGED_TABLE。打开MySQL客户端工具，如navicat，点击连接，选择MySQL，连接名可以任意取（如：192.168.73.105-hive），主机处填写Linux虚拟机的IP地址（192.168.73.105），端口默认为3306，用户名默认为root，若创建了用户，则为其他用户名，密码为MySQL密码（Root@123)，切勿与Linux虚拟机的密码混淆。连接之前要确保Linux虚拟机处于开启状态才能连接成功，在点击确认之前可以先点击“测试连接”，若提示成功，再点击确认按钮，若失败，先检查一下Linux虚拟机是否开启，密码是否输入正确了。若已经完成了创建操作，但是不能成功连接数据库，可以先右键点击该连接名，选择“编辑连接”即可。连接成功后，双击选择“metastore”，选择“表”，选择“tals”，右侧就可以看到Hive里面的表的相关信息。

| 操作       | 命令                             |
| ---------- | -------------------------------- |
| 切换数据库 | use userdb;                      |
| 创建数据表 | create table mytab(line string); |

### 内部表加载数据

​	将已经创建好的txt.txt文件上传到master节点的/home目录下，先在Windows上新建一个文本文件，命名为“txt.txt”，在里面写入内容。然后将此文件拖拽到Linux虚拟机的home下，若失败，可能是网络问题。可以直接在Linux虚拟机上创建txt.txt文件，在Linux虚拟机上输入内容。也可以直接使用vi命令，当此文件不存在时，会自动创建该文件。在hive的命令行环境下，输入命令将/home/txt.txt加载到userdb.mytab表中。“load data”用于加载数据（Hive 专用语法）；“local”指的是文件在本地 Linux 机器上而不是 HDFS，若在HDFS上上传则不包含这个参数；“inpath '/home/txt.txt'”指的是本地文件路径；“into table”追加到表但不覆盖旧数据；“userdb.mytab”库名，此处为userdb 库下的 mytab 表。

| 操作                                | 命令                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| 切换目录                            | cd /home                                                     |
| 创建txt.txt文件                     | touch txt.txt                                                |
| 输入内容                            | vi txt.txt                                                   |
| 将/home/txt.txt加载到userdb.mytab表 | load data local inpath '/home/txt.txt' into table userdb.mytab ; |
| 查看mytab表内容                     | select * from mytab;                                         |

​	如果数据在hdfs中，可以通过命令将hdfs中的文件加载到userdb.mytab表中。开启远程终端，把之前创建好的测试数据文件全部上传到/home目录下，然后在终端中将/home/txt.txt文件改名称为txt1.txt后上传到HDFS的根目录下。切换到Hive的命令行模式下，将HDFS根目录下的txt.txt文件加载到hive的userdb.mytab 表中， 加上上一步中已经加载到mytab表中的数据，可以看到当前的数据为：txt.txt和txt1.txt文件中的数据。在Linux本地上传文件和在HDFS上传文件的命令中，前者比后者多输入了“local”。

| 操作                       | 命令                                                  |
| -------------------------- | ----------------------------------------------------- |
| 切换到home目录             | cd /home                                              |
| 将txt.txt复制为txt1.txt    | cp /home/txt.txt /home/txt1.txt                       |
| 将测试数据上传到HDFS根目录 | hadoop fs -put /home/txt1.txt /                       |
| 查看txt1.txt内容           | hadoop fs -cat /txt1.txt                              |
| 将HDFS根目录下的文件上传   | load data inpath '/txt1.txt' into table userdb.mytab; |
| 查看mytab表内容            | select * from mytab;                                  |

### 利用内部表测试wordcount查询

​	先准备好txt2.txt 测试文件，可以复制一份txt1.txt文件，也可以重新创建一份新的测试数据。将准备好的txt2.txt测试数据上传到Linux的/home目录下，并在Hive命令行界面中把txt2.txt文件加载到userdb.mytab表中。然后利用内部表测试查询。

| 操作                               | 命令                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| 复制txt1.txt文件                   | cp /home/txt1.txt /home/txt2.txt                             |
| 新建新的测试数据                   | vi /home/txt2.txt                                            |
| 将txt2.txt文件加载到userdb.mytab表 | load data local inpath '/home/txt2.txt' into table userdb.mytab ; |
| 测试查询                           | select * from mytab;                                         |

### 使用自定义分隔符创建内部表

​	在“CREATE TABLE”后加上表名（student2）和字段属性(id int, name string)。后加“ row format delimited fields terminated by '\t' ”。“row format delimited”告诉 Hive，你的数据文件是 “按行分隔的文本格式；“fields terminated by '\t'”指定字段分隔符，数据文件中字段之间必须用 Tab 键分隔。可以通过hadoop的命令上传数据文件加载数据，如果使用虚拟机操作时，可以使用insert语句插入数据。“insert into ”后加上表名（student2）及属性(id,name) ，“insert into ”执行的是追加操作，不会覆盖原有数据， “insert overwrite”将覆盖原有数据，要慎用！其后接values及要添加的数据(1,'zhangsan')，字符串必须用 单引号 ' '，不能用双引号，在加入多条数据的时候，使用逗号将多个数据隔开（...values(1,'zhangsan'),(2,'tulip'),(3,'dcy');）字符串必须用 单引号 ' '，不能用双引号。在执行过程中，等待时间会比较长。

| 操作                            | 命令                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| 使用自定义分隔符创建内部表      | CREATE TABLE student2(id int, name string) row format delimited fields terminated by '\t' ; |
| 使用Hadoop命令上传测试数据      | hadoop fs -put 本地文件 HDFS目录                             |
| 使用insert插入数据              | insert into student2(id,name) values(1,'zhangsan');          |
| 通过查询语句查看表中的数据      | select  * from student2;                                     |
| 通过查询语句查看表中id为1的数据 | select * from student2 where id>1;                           |

###  创建和管理外部表

​	创建外部表。先创建student.txt文件，文件中的数据每一行的数据里面使用tab键隔开（1	tulip），然后创建/mydir目录。上传已经创建好的student.txt文件到HDFS中的/mydir目录下，在HDFS上创建目录，把/home/student.txt上传到HDFS的/mydir目录下。

student.txt表内容示例

```tex
1	tulip
2	dcy
3	aaa
4	bbb
5	ccc
```

| 操作                   | 命令                                   |
| ---------------------- | -------------------------------------- |
| 创建student.txt文件    | vi /home/student.txt                   |
| 创建/mydir目录         | hdfs dfs -mkdir /mydir                 |
| 上传文件到HDFS中       | hdfs dfs -put /home/student.txt /mydir |
| 查看/mydir目录下的内容 | hdfs dfs -ls /mydir                    |
| 查看/mydir/student.txt | hdfs dfs -cat /mydir/student.txt       |

​	为外部表加载数据。把已经上传到HDFS的/mydir/student.txt 文件作为Hive创建的外部表的数据。创建一个外部表。“external”表示这是外部表。外部表（external），数据自己放，Hive 只管结构。内部表（managed table），Hive 自己管理数据。“student(id int,name string )”，student为表名，括号内的内容为表的结构，字段的定义。“row format delimited fields terminated by '\t'”表示文本行分隔，字段分隔符为Tab 键。“location '/mydir”指定数据在 HDFS 上的路径，意思就是Hive 去 HDFS 的 /mydir 目录读数据，你把文件放到 /mydir 里，Hive 自动能查到。

| 操作                | 命令                                                         |
| ------------------- | ------------------------------------------------------------ |
| 创建外部表          | create external table student(id int,name string ) row format delimited fields terminated by '\t' location '/mydir'; |
| 查看student表的内容 | select * from student;                                       |

| 类型       | 删表时                           | 数据存放      | 生产常用                  |
| ---------- | -------------------------------- | ------------- | ------------------------- |
| **内部表** | **表 + 数据一起删掉**            | Hive 自动管理 | 临时表                    |
| **外部表** | **只删表结构，数据还在 HDFS 里** | 自己指定路径  | **生产环境 99% 都用它！** |

​	修改外部表的数据.在HDFS上创建/mydir2目录，把student.txt文件中的记录做修改后上传到HDFS中的/mydir2目录下。切换到Hive的命令行模式下，使用命令修改已有的外部表（student）的数据目录为/mydir2/查看student表中的数据，可以看到表中的内容已经修改为HDFS中/mydir2目录下的文件数据。

| 操作                     | 命令                                        |
| ------------------------ | ------------------------------------------- |
| 创建/mydir2目录          | hdfs dfs -mkdir /mydir2                     |
| 修改已有外部表的数据目录 | alter table student set location '/mydir2'; |
| 查看student表中的数据    | select * from student;                      |

​	删除外部表使用语句切换到终端窗口，查看HDFS中的/mydir2目录和文件并没有被删除（内部表一旦删除，数据目录和文件也被删除，而外部表被删除后，数据目录和文件不会被删除，需  要手工去删除

| 操作       | 命令                |
| ---------- | ------------------- |
| 删除外部表 | drop table student; |

### 内外部表互相转换

​	创建一个外部表.外部表转化为内部表。“external”表示这是外部表。外部表（external），数据自己放，Hive 只管结构。内部表（managed table），Hive 自己管理数据。“student(id int,name string )”，student为表名，括号内的内容为表的结构，字段的定义。“row format delimited fields terminated by '\t'”表示文本行分隔，字段分隔符为Tab 键。“location '/mydir”指定数据在 HDFS 上的路径，意思就是Hive 去 HDFS 的 /mydir 目录读数据，你把文件放到 /mydir 里，Hive 自动能查到。修改外部表的属性为内部表。set tblproperties，设置表属性，('EXTERNAL'='FALSE')，EXTERNAL判断是否外部表，FALSE表示 不是外部表 = 内部表。删除转化过来的内部表后，切换到终端窗口，查看HDFS中，mydir目录已经被删除掉。

| 操作                     | 命令                                                         |
| ------------------------ | ------------------------------------------------------------ |
| 创建一个外部表           | create external table student(id int,name string ) row format delimited fields terminated by '\t' location '/mydir'; |
| 修改外部表的属性为内部表 | alter table student set tblproperties ('EXTERNAL'='FALSE');  |
| 删除转化过来的内部表     | drop table student;                                          |

​	内部表转化为外部表。修改内部表student2为外部表 set tblproperties，设置表属性，('EXTERNAL'='FALSE')，EXTERNAL判断是否外部表，FALSE表示 不是外部表 = 内部表。删除student2表。查看数据文件仍然存在。

| 操作                       | 命令                                                        |
| -------------------------- | ----------------------------------------------------------- |
| 修改内部表student2为外部表 | alter table student2 set tblproperties ('EXTERNAL'='TRUE'); |
| 将HDFS根目录下的文件上传   | load data inpath '/txt1.txt' into table userdb.mytab;       |
| 查看student2表中的数据     | select * from student2;                                     |
| 删除student2表             | drop table student2;                                        |
| 查看数据文件               | hdfs dfs -ls /user/hive/warehouse/userdb.db                 |

## Hive 分区表实验

### 准备使用分区表所需的测试数据

​	在本地windows电脑上创建以下文件，作为使用分区表所需的测试数据：

第一个文件：student.txt文件，文件内容如下（注意，字段之间的分隔符使用“TAB”键进行分隔，即：\t）： 
```txt
1	zhangsan
2	lisi
3	wangwu
```


第二个文件：student1.txt文件，文件内容如下（注意，字段之间的分隔符使用“TAB”键进行分隔，即：\t）： 
```txt
4	zhaoliu
5	yangqi
```


第三个文件：student2.txt文件，文件内容如下（注意，字段之间的分隔符使用“TAB”键进行分隔，即：\t）： 
```txt
6	zhangwuji 
7	meichaofeng
8	huangdaozhu 
```
​	把以上三个文件都上传到master节点的/home目录下，备用

### 创建和管理分区表

​	创建分区表

​	在hive命令行模式下，通过命令创建数据库（可以通过：show databases 查看已有数据库，如果已经存在userdb数据库，则不必重复创建）

​	`CREATE DATABASE userdb;`

​	通过use命令使当前数据库设定为userdb。

​	`use userdb;`

​	然后在userdb数据库下创建分区表。partitioned by(dt date comment "partition field day time")作用是给表添加分区字段 dt（分区≠普通字段，是 Hive 用来优化查询的特殊字段）。dt指区字段名（一般代表日期，day time）；date指分区字段类型（日期类型，格式如 2026-04-02）；comment "xxx"指给字段加注释，方便别人看懂这个字段的用途。row format delimited的作用是告诉 Hive数据是按行分隔的文本格式，这是 Hive 读取本地 / TXT/CSV 文件的标准格式声明。fields terminated by '\t'的作用是指定列与列之间的分隔符是 制表符 (Tab 键)，\t = Tab 键，意思是Hive 读取数据时，遇到 Tab 就自动分割成两列（id 和 name）。

​	`create table student(id int, name string) partitioned by(dt date comment "partition field day time") row format delimited fields terminated by '\t';`


​	通过show tables命令查看已经创建的student表

​	`show tables;`


​	通过show partitions student; 命令查看student表的分区信息（由于表刚刚创建，此时看不到相关分区信息）

​	`show partitions student;`


​	给分区表增加分区，增加分区后，既可以通过show partitions student命令查看的分区信息

​	`alter table student add partition(dt="2017-07-20"); `

​	`show partitions student;`


​	继续增加多个分区： 

​	`alter table student add partition(dt="2017-07-21"); `

​	`alter table student add partition(dt="2017-07-22");`

​	给分区表加载数据

​	`load data local inpath '/home/student.txt' into table student partition(dt='2017-07-20'); load data local inpath '/home/student1.txt' into table student partition(dt='2017-07-21'); `

​	`load data local inpath '/home/student2.txt' into table student partition(dt='2017-07-22');`

​	可以查看加载成功的数据 

​	`select * from student; `

​	给分区表删除分区:

​	`alter table student drop partition(dt="2017-07-21");`

### 对分区表进行数据查询

​	使用HQL查询语句对分区表进行查询 

​	`select * from student where dt='2017-07-20';`

​	输入相关命令，进行数据查询

​	`select * from student where dt='2017-07-20' or dt='2017-07-22' ;`

## Hive分桶表实验

### 准备Hive的初始环境和测试数据

步骤1：准备Hive数据仓库所需的测试数据

准备Hive的安装部署文件： 

在本地电脑上创建user.txt文件，文件内容如下（注意，字段之间的分隔符使用“TAB”键进行分隔，即：\t）

把已经准备好的user.txt文件上传到master节点的/home目录下

### 创建和管理分桶表

先创建内部表并加载数据

由于分桶表不能直接加载数据，只能从另一张表中插入数据，因此我们需要先创建一个内部表，并加载数据，作为后续创建的分桶表的数据源

`CREATE TABLE temp(id int, name string) row format delimited fields terminated by '\t'; `

然后加载数据到temp表中

`load data local inpath '/home/user.txt' into table userdb.temp ;`

### 创建分桶表

创建桶表，使用CLUSTERED BY 子句来指定划分桶所用的列和要划分的桶的个数：

`CREATE TABLE users (id INT,name STRING) CLUSTERED BY (id) INTO 16 BUCKETS;`

### 加载数据

桶表不能通过load的方式直接加载数据，只能从另一张表中插入数据，在这里，我们使用前面已经创建好的temp表的数据作为user表的数据来源： 

`insert into table users select id,name from temp;`

### 查看桶表中的数据

查询users表的数据

`select * from users;`

查看分桶表的hdfs目录结构

重新启动一个终端，连接到master节点，通过hadoop命令查看分桶表users的文件结构： 

`hadoop fs -ls /user/hive/warehouse/userdb.db/users/`

查看第一个桶的数据： 

`hadoop fs -cat /user/hive/warehouse/userdb.db/users/000000_0`

### 分桶表的数据查询

分桶表的基本数据查询

通过HQL语言对分桶表进行数据查询： 

`select * from users where id>150;`

对分桶表进行取样操作

提取16/8=2个桶的数据，分别是：第3个桶和（3+8=11）桶的数据。 

`SELECT * FROM users TABLESAMPLE(BUCKET 3 OUT OF 8 );`

 

 