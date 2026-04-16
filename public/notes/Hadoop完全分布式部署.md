# 环境准备
## JDK
解压JDK，先切换到安装包所在目录
cd /home
使用tar 解压命令
tar -zxvf  jdk-8u112-linux-x64.tar.gz  -C  /opt
编辑profile文件
vi /etc/profile
``` xml
	export JAVA_HOME=/opt/jdk1.8.0_112
	export JRE_HOME=/opt/jdk1.8.0_112/jre
	export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
	export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```
更新配置
source /etc/profile

# 配置Hadoop
## Hadoop完全分布式部署
### 修改hosts文件
vi /etc/hosts
加上主机IP和主机名，形成映射关系。
```txt
192.168.73.102 master
192.168.73.103 slave1
192.168.73.104 slave2
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
```

### 解压Hadoop，先切换到Hadoop安装包所在位置
cd /home
使用tar 解压命令
tar  -zxvf  hadoop-2.9.2.tar.gz  -C  /opt

### 设置免密登录
#### 生成密钥文件
分别在三台虚拟机上运行
master,slave1,slave2：ssh-keygen -t rsa
slave1： scp /root/.ssh/id_rsa.pub root@master:/root/.ssh/id_rsa.pub.slave1
slave2：scp /root/.ssh/id_rsa.pub root@master:/root/.ssh/id_rsa.pub.slave2

#### 在**master**节点上生成**authorized_keys**文件：
登录 master 节点，查看/root/.ssh 目录下拷贝过来的文件，并生成 authorized_keys 文件：
cd /root/.ssh
ls
cat id_rsa.pub >> authorized_keys
cat id_rsa.pub.slave1 >> authorized_keys
cat id_rsa.pub.slave2 >> authorized_keys
cat  authorized_keys

#### 分发主节点上的 authorized_keys 文件到 从节点上
scp /root/.ssh/authorized_keys root@slave1:/root/.ssh/authorized_keys
scp /root/.ssh/authorized_keys root@slave2:/root/.ssh/authorized_keys
分发时失败，可能是因为从节点的密钥没有正确生成，可以先重新生成一下，未能解决时，先删除.ssh 文件，在重新生成（.ssh/密钥）

#### 测试集群各个节点免秘钥登录成功
登录各个虚拟机，通过 ssh 命令连接到各个节点，不需要再输入密码：
ssh master
ssh slave1
ssh slave2

### 修改配置文件
切换到配置文件目录
cd /opt/hadoop-2.9.2/etc/hadoop

配置hadoop-env.sh:
vi hadoop-env.sh
将export JAVA_HOME=${JAVA_HOME} 修改为  export JAVA_HOME=/opt/jdk1.8.0_112
其中/opt/jdk1.8.0_112 为JDK的安装路径

配置core-site.xml
vi core-site.xml
```xml
<property>
<name>fs.defaultFS</name>
<value>hdfs://master:9000</value>
</property>
<property>
<name>hadoop.tmp.dir</name>
<value>/home/hadoop/hdfs/tmp</value>
</property> 
```

配置hdfs-site.xml
vi hdfs-site.xml
```xml
<property>
    <name>dfs.replication</name>
    <value>2</value>
</property>
<property>
    <name>dfs.namenode.name.dir</name>
    <value>/home/hadoop/hdfs/name</value>
</property>
<property>
    <name>dfs.datanode.data.dir</name>
    <value>/home/hadoop/hdfs/data</value>
</property>
<property>
    <name>dfs.permissions</name>
    <value>false</value>
</property>
```
  
  
配置 yarn-site.xml
vi yarn-site.xml
```xml
<property>
<name>yarn.resourcemanager.hostname</name>
<value>master</value>
</property>
<property>
<name>yarn.nodemanager.aux-services</name>
<value>mapreduce_shuffle</value>
</property>
```
	
配置slaves
vi /opt/hadoop-2.9.2/etc/hadoop/slaves
先删除localhost，在编辑配置文件
~~~
slave1
slave2
~~~

### 远程复制配置文件
在 master 结点上运行如下命令，将安装和配置拷贝到从节点：
scp -r /opt/hadoop-2.9.2/etc/hadoop root@slave1:/opt/hadoop-2.9.2/etc
scp -r /opt/hadoop-2.9.2/etc/hadoop root@slave2:/opt/hadoop-2.9.2/etc

### 修改配置环境变量
vi /etc/profile
```
export HADOOP_HOME=/opt/hadoop-2.9.2
export PATH=$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH
```
更新配置
source /etc/profile

## 开始初始化和启动Hadoop
### 使用绝对路径
当环境变量配置出了问题时或没有配置环境变量的时候，使用相对路径将无法启动Hadoop，此时需要先切换到Hadoop的安装目录下的/bin目录。
```
cd /opt/hadoop-2.9.2/bin
./hadoop  namenode  -format
cd  /opt/hadoop-2.9.2/sbin
./start-all.sh
```
或
```
/opt/hadoop-2.9.2/bin/hdfs namenode -format
/opt/hadoop-2.9.2/sbin/start-all.sh
```

### 使用相对路径
使用相对路径之前一定要确保配置了环境变量，否则将找不到Hadoop的启动文件
```
hdfs namenode -format
start-all.sh
```


# 验证是否安装成功
## Jps命令
在命令行模式下输入  jps   查看进程数量。正常情况下，有五个Hadoop进程（不含Jps），
主节点有三个Hadoop进程(NameNode,ResourceManager,SecondaryNameNode)，从节点有两个Hadoop进程（NodeManager,DataNode）。
分别是NameNode,ResourceManager,NodeManager,SecondaryNameNode,DataNode。
## Hadoop命令
```
hadoop fs -ls  /
hadoop fs -mkdir  /test
hadoop fs -ls  /
```
若没有配置环境变量，需在Hadoop之前加上Hadoop的启动文件所在路径，即./hadoop-2.9.2/bin。
 
## 打开HDFS UI页面
在浏览器中搜索网址 http:192.168.73.101:50070 ，即主节点主机IP加50070端口。

# 常见问题
1.Linux 系统中 SSH 连接远程主机时出现的严重安全警告，核心原因是远程主机的密钥发生了变更。
直接编辑known_hosts文件删除,在/root/.ssh/known_hosts找到包含 当前主机所在 的行，删除并保存，然后重新进行免密钥配置。

2.缺失DataNode进程，核心原因是上次关闭主机时没有正常关闭Hadoop。
可以先尝试重新启动Hadoop，让DataNode进程正常关闭。先停掉Hadoop：stop-all.sh，启动hadoop:start-all.sh。
可以尝试先删掉/home里面的Hadoop/data日志文件，然后关闭Hadoop:stop-all.sh，在重新启动hadoop:start-all.sh。
