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
## Hadoop伪分布式部署
### 修改hosts文件
vi /etc/hosts
加上主机IP和主机名，形成映射关系。
```txt
192.168.73.100 hadoop01  
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
```

### 解压Hadoop，先切换到Hadoop安装包所在位置
cd /home
使用tar 解压命令
tar  -zxvf  hadoop-2.9.2.tar.gz  -C  /opt

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
    <name>fs.default.name</name>
    <value>hdfs://hadoop01:9000</value>
 </property> 
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://hadoop01:9000</value>
 </property>
<property>
    <name>hadoop.tmp.dir</name>
    <value>/home/hadoop/tmp</value>
 </property> 
```

配置hdfs-site.xml
vi hdfs-site.xml
```xml
<property>
    <name>dfs.replication</name>
    <value>1</value>
 </property>
<property>
    <name>dfs.name.dir</name>
    <value>/home/hadoop/name</value>
 </property>
<property>
<name>dfs.datanode.data.dir</name>
    <value>/home/hadoop/data</value>
  </property> 
```
  
配置 mapred-site.xml
该配置文件本不存在，得先重命名mapred-site.xml.template为mapred-site.xml ，然后再编辑配置文件
mv mapred-site.xml.template mapred-site.xml
vi mapred-site.xml
```xml
<property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property> 
```
  
配置 yarn-site.xml
vi yarn-site.xml
```xml
  <property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
    </property>
  <property>
  <name>yarn.resourcemanager.address</name>
  <value>hadoop01</value>
    </property> 
```
	
### 修改配置文件
vi /etc/profile
```
export HADOOP_HOME=/opt/hadoop-2.9.2
export PATH=$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH
```
更新配置
source /etc/profile

## 配置本地免秘钥登录
```
cd  /root
cd  .ssh
ssh-keygen  -t  rsa
cat  id_rsa.pub >> authorized_keys
ssh  hadoop01
```
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
在命令行模式下输入  jps   查看进程数量。正常情况下，有五个Hadoop进程（不含Jps）。
分别是NameNode,ResourceManager,NodeManager,SecondaryNameNode,DataNode。
## Hadoop命令
```
hadoop fs -ls  /
hadoop fs -mkdir  /test
hadoop fs -ls  /
```
若没有配置环境变量，需在Hadoop之前加上Hadoop的启动文件所在路径，即./hadoop-2.9.2/bin。
 
## 打开HDFS UI页面
在浏览器中搜索网址 http:192.168.73.100:50070 ，即主机IP加50070端口。

# 常见问题
1.Linux 系统中 SSH 连接远程主机时出现的严重安全警告，核心原因是远程主机的密钥发生了变更。
直接编辑known_hosts文件删除,在/root/.ssh/known_hosts找到包含 当前主机所在 的行，删除并保存，然后重新进行免密钥配置。

2.缺失DataNode进程，核心原因是上次关闭主机时没有正常关闭Hadoop。
可以先尝试重新启动Hadoop，让DataNode进程正常关闭。先停掉Hadoop：stop-all.sh，启动hadoop:start-all.sh。
可以尝试先删掉/home里面的Hadoop/data日志文件，然后关闭Hadoop:stop-all.sh，在重新启动hadoop:start-all.sh。
