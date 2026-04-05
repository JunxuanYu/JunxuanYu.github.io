## 准备 

启动两个虚拟机，分别在/etc/hosts 加入IP 和主机名

vi /etc/hosts
```
192.168.7.10 flume1
192.168.7.11 flume2
```

## 配置master

1：启动远程终端，连接master节点，查看/home目录下确认存在Flume的安装包：apache-flume-1.8.0-bin.tar.gz文件， 进入/opt/目
录下，确认在/opt目录下存在Flume的解压缩后的文件夹；（如果/opt下没有Flume的解压缩文件，请把/home下的apache-flume-
1.8.0-bin.tar.gz 解压到/opt目录下： 
cd /home
tar -zxvf apache-flume-1.8.0-bin.tar.gz -C /opt/

2：开始配置master节点上的Flume配置，进入master节点的/opt/apache-flume-1.8.0-bin/conf目录下的flume-env.sh.template
为：flume-env.sh，然后编辑该文件： 
cd /opt/apache-flume-1.8.0-bin/conf 
cp flume-env.sh.template flume-env.sh

3：编辑flume-env.sh文件： vi flume-env.sh 将#注释去掉，加上自己的JAVA_HOME后保存退出： 
vi flume-env.sh
export JAVA_HOME=/opt/jdk1.8.0_112

4：开始配置master节点的配置文件： 基本思路： 监听telnet的444端口（ sources的 type = netcat ； bind = master ； port =
444 ） 发送到第二台机器（Flume2）（sinks的type = avro ； hostname=slave1 ； port = 555 ） 在windows本地创建文件：
flume_flume_1.conf ，文件中内容如下： 

在两个Hadoop伪分布下的操作

```
a1.sources = r1 
a1.channels = c1 
a1.sinks = k1
a1.sources.r1.type = netcat 
a1.sources.r1.bind = master 
a1.sources.r1.port = 444
a1.sinks.k1.type = avro 
a1.sinks.k1.channel = c1 
a1.sinks.k1.hostname=slave1 
a1.sinks.k1.port = 555
a1.channels.c1.type = memory 
a1.channels.c1.capacity = 100 
a1.channels.c1.transactionCapacity = 100
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```

在一主二从集群下的操作。

```
a1.sources = r1
a1.channels = c1
a1.sinks = k1 k2
# Source
a1.sources.r1.type = netcat
a1.sources.r1.bind = master
a1.sources.r1.port = 444
# Sink1 -> slave1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = slave1
a1.sinks.k1.port = 555
# Sink2 -> slave2
a1.sinks.k2.type = avro
a1.sinks.k2.hostname = slave2
a1.sinks.k2.port = 666
# Channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 100
a1.channels.c1.transactionCapacity = 100
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
a1.sinks.k2.channel = c1
```
5：编辑好以后上传到/opt/apache-flume-1.8.0-bin/conf目录下

## 配置slave
1：启动远程终端，连接slave1节点，查看/home目录下确认存在Flume的安装包：apache-flume-1.8.0-bin.tar.gz文件， 进入/opt/目
录下，确认在/opt目录下存在Flume的解压缩后的文件夹；（如果/opt下没有Flume的解压缩文件，请把/home下的apache-flume-
1.8.0-bin.tar.gz 解压到/opt目录下： 
cd /home
tar -zxvf apache-flume-1.8.0-bin.tar.gz -C /opt/

2：开始配置slave1节点上的Flume配置，进入master节点的/opt/apache-flume-1.8.0-bin/conf目录下的flume-env.sh.template
为：flume-env.sh，然后编辑该文件： 
cd /opt/apache-flume-1.8.0-bin/conf 
cp flume-env.sh.template flume-env.sh

3：编辑flume-env.sh文件： vi flume-env.sh 将#注释去掉，加上自己的JAVA_HOME后保存退出：
vi flume-env.sh 
export JAVA_HOME=/opt/jdk1.8.0_112

4：开始配置slave1节点的配置文件： 基本思路： 第二台机器（Flume2）（sinks的type = avro ； hostname=slave1 ； port =
555 ） 在windows本地创建文件：flume_flume_2.conf ，文件中内容如下：

```
a1.sources = r1
a1.channels = c1
a1.sinks = k1
a1.sources.r1.type = avro 
a1.sources.r1.bind = slave1 
a1.sources.r1.port = 555
a1.sinks.k1.type = logger
a1.channels.c1.type = memory 
a1.channels.c1.capacity = 100 
a1.channels.c1.transactionCapacity = 100
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
```



5：编辑好以后上传到/opt/apache-flume-1.8.0-bin/conf目录下：

## 在windows客户机上准备telnet环境
配置本地windows的telnet功能


启动两级Flume开始监听telnet发送消息
启动Flume开始监听
开启终端连接slave1节点，然后进入：/opt/apache-flume-1.8.0-bin目录下，在slave1节点上运行命令：
cd /opt/apache-flume-1.8.0-bin
bin/flume-ng agent --conf conf --conf-file conf/flume_flume_2.conf --name a1 -Dflume.root.logger=INFO,console

开启终端并连接master节点，然后进入：/opt/apache-flume-1.8.0-bin目录下，在master节点上运行命令： 
cd /opt/apache-flume-1.8.0-bin
bin/flume-ng agent --conf conf --conf-file conf/flume_flume_1.conf --name a1 -Dflume.root.logger=INFO,console

启动windows的命令行工具，然后根据master节点的ip地址，通过telnet向master服务器发送消息： 
telnet 10.244.2.28 444

# flume的自定义source实验

​	启动远程终端，连接到master节点。查看JDK环境，确保两台机器上都安装并配置好JDK环境，可以通过：`java -version `查看版本。

下载所需jar包
连接到master节点，进入/opt目录下的Flume解压缩后的文件：` cd /opt/apache-flume-1.8.0-bin/lib/ `找到：
flume-ng- configuration-1.8.0.jar
flume-ng-core-1.8.0.jar
flume-ng-sdk-1.8.0.jar 
三个jar包并下载到本地(Windows），可以在远程终端直接拖拽出来

启动Ecplise ，创建Java工程，工程名称为：
`mySource`

拷贝已经下载的3个jar包到工程目录下，并添加引用

在项目中添加flume包，在flume包下添加plugin包，然后在plugin包下的MyFlumeSource.java文件

| 操作 | 名称          |
| ---- | ------------- |
| 包名 | flume.plugin  |
| 类名 | MyFlumeSource |

代码如下：
```java
package flume.plugin;

import java.nio.charset.Charset;
import java.util.HashMap;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.EventDeliveryException;
import org.apache.flume.PollableSource;
import org.apache.flume.conf.Configurable;
import org.apache.flume.event.EventBuilder;
import org.apache.flume.source.AbstractSource;

public class MyFlumeSource extends AbstractSource implements Configurable, PollableSource {
	public synchronized void start() {
		// TODO Auto-generated method stub
		super.start(); // 启动时自动调用，可以进行初始化
		currentvalue = 100;
	}

	public synchronized void stop() { // TODO Auto-generated method stub
		super.stop(); // 退出时回收资源

		currentvalue = 0;
	}

	private static int currentvalue = 0;
	private long interval;

	public long getBackOffSleepIncrement() {
		return 0;
	}

	public long getMaxBackOffSleepInterval() {
		return 0;
	}

	public Status process() throws EventDeliveryException {
		try {
			int s = currentvalue;
			HashMap header = new HashMap();
			header.put("id", Integer.toString(s));
			Event e = EventBuilder.withBody("no:" + Integer.toString(s), Charset.forName("UTF-8"), header);
			this.getChannelProcessor().processEvent(e);
			currentvalue++;
			Thread.sleep(interval);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return Status.READY;
	}

	public void configure(Context arg0) {
		interval = arg0.getLong("interval", Long.valueOf(1000l)).longValue();
	}
}

```

工程导出jar包并上传。右键点击类名，选择Export，选择JAR file  ，点击下一步后，在JAR file 中选择存放的地址和jar包名称。最后点击结束即可。设定jar包名称为：`mysource.jar`

上传jar包到master节点上
将java工程导出jar包，并上传到：/opt/apache-flume-1.8.0-bin/lib目录下：	

开始编写配置文件
在windows本地电脑上创建文件：`mysource.conf `，添加以下配置信息后，上传到master节点的/opt/apache-flume-1.8.0-bin/conf目录下： 文件内容如下：

  ```
 # Name the components on this agent 
a1.sources = r1 
a1.sinks = k1 
a1.channels = c1
a1.sources.r1.type = flume.plugin.MyFlumeSource 
a1.sources.r1.interval=4000
# Describe the sink 
a1.sinks.k1.type = logger
# Use a channel which buffers events in memory 
a1.channels.c1.type = memory 
a1.channels.c1.capacity = 100 
a1.channels.c1.transactionCapacity = 100
# Bind the source and sink to the channel 
a1.sources.r1.channels = c1 
a1.sinks.k1.channel = c1
  ```
上传配置文件
mysource.conf 上传到/opt/apache-flume-1.8.0-bin/conf目录下

启动Flume开始监听
开启终端并连接服务器，然后进入目录：
	cd /opt/apache-flume-1.8.0-bin 
	bin/flume-ng agent --conf conf --conf-file conf/mysource.conf --name a1 -Dflume.root.logger=INFO,console

可以看到系统不断产生事件：根据配置文件中interval参数设定的时间间隔，对数据不断累加











