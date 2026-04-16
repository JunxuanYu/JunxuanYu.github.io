# 环境准备
## JDK配置
先在宿主机下载JDK1.8

配置JDK环境变量
右键点击此电脑，属性，高级系统设置，环境变量，选择下面的新建（path变量已有，不用新建，直接在里面添加）。
（方法二：点击设置，选择系统，系统信息，高级系统设置，环境变量）
JAVA_HOME（新建） ：  jdk安装路径
CLASSPATH（新建）：   .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;   /*此处实际上是定义了两个环境变量，使用；隔开*/
Path（已有直接添加）: %JAVA_HOME%\bin
                    %JAVA_HOME%\jre\bin         /*此行要与上一行，分别新建在Path里面*/
					
# Hadoop部署
先在宿主机安装Hadoop2.9.0

## 配置Hadoop环境变量
右键点击此电脑，属性，高级系统设置，环境变量，选择下面的新建（path变量已有，不用新建，直接在里面添加）。
（方法二：点击设置，选择系统，系统信息，高级系统设置，环境变量）
HADOOP_HOME（新建）:    hadoop安装路径
Path（已有直接添加）：%HADOOP_HOME%\bin
                    %HADOOP_HOME%\sbin      /*此行要与上一行，分别新建在Path里面*/
					
## 修改Hadoop配置文件
在hadoop-2.9.2\hadoop-2.9.2\etc\hadoop目录下找到**hadoop-env.cmd**
使用记事本打开该配置文件，找到**set JAVA_HOME**，将后面的路径修改成JDK的安装路径。**set JAVA_HOME=C:\PROGRA~1\Java\jdk1.8.0_151**

## 提供虚拟环境
将hadoop-2.9.2\bin目录下的hadoop.dll复制到C:\Windows\System32下

# 检验安装
在命令行中输入 **hadoop version**，查看版本号是否正确。