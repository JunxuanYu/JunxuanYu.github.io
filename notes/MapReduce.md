# Hadoop在Windows中部署

在使用之前需要先在本地配置好Hadoop环境。

## Hadoop的安装

​	先下载Hadoop软件，安装完成后，将Hadoop的安装路径保存下来，右键点击此电脑，依次点击属性，高级系统设置，环境变量，选择下面的新建，新建一个`HADOOP_HOME`，在里面填写你的Hadoop安装路径，接着打开`Path`在里面添加`%HADOOP_HOME%\bin`和`%HADOOP_HOME%\sbin`。然后打开Hadoop安装目录下的`etc\hadoop`目录，找到`hadoop-env.cmd  `文件，可以使用记事本进行编辑，可以直接拖拽到记事本中。然后找到`set JAVA_HOME=C:\PROGRA~1\Java\jdk1.8.0_151`,将JDK安装路径修改成自己的实际路径。最后将`hadoop-2.9.2\bin`目录下的`hadoop.dll`复制到`C:\Windows\System32`下，使用`win+R`打开命令行，使用`hadoop version`查看Hadoop版本，若不成功，可能是系统还没更新过来，可重启电脑后再查看Hadoop版本。

## Hadoop插件的安装

​	在eclipse中进行MapReduce编程时，需要事先安装Hadoop插件后才可以进行MapReduce编程。

​	先下载 **hadoop-eclipse-plugin-2.7.0.jar** 然后将该插件放置到 **eclipse-jee-mars-2-win32-x86_64\eclipse\plugins**即eclipse的安装目录中的plugins目录。在eclipse创建新的项目时，若能看见**Map/Reduce Project**则证明安装成功。

# 框架

```java
/*
* Mapper类
* LongWritable key, Text value, Context context  类型要一一对应。
*/
public static class MyMapperTask extends Mapper<LongWritable, Text, Text, IntWritable> {
@Override
protected void map(LongWritable key, Text value, Context context) throws IOException,
InterruptedException {
//TODO 功能实现部分
}
}
/*
* Reducer类
*/
public static class ReduceTask extends Reducer<Text, IntWritable, Text, IntWritable> {
@Override
protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws
IOException, InterruptedException {
//TODO  功能实现部分
}
}

/*
* Driver 类
*/
public static void main(String[] args) throws Exception {
//TODO  功能实现部分
}
```

## 常用案例

### 词频统计

#### 前期准备

​	依次选择file—new—Map/Reduce，若点开new后没有看到**Map/Reduce**可以选择**Other**在里面找到**Map/Reduce**。选择Map/Reduce后，在**Project Name**中填写项目名即可。在**User default Hadoop**中点击**Configure Hadoop install directory...**选择Hadoop的安装路径。最后点击**Finish**即可完成项目的创建。

​	接着点击项目名，右键点击**src**，新建package（new-package-name:输入包名)，再右键点击包名，新建class（new-class-name:输入类名），双击类名即可开始编写代码。

#### 代码编写

```java
public class WordCount {	
	/*
	 * Mapper类
	 */
     /**四个泛型：
        输入key, 输入value, 输出key, 输出value
        LongWritable：行偏移量（行的位置）
        Text：一行文本
        输出 Text：单词
        输出 IntWritable：固定为 1
	 */	
	public static class MyMapperTask extends Mapper<LongWritable, Text, Text, IntWritable> {
		@Override
        //key：行号 / 偏移量（基本不用管）;value：当前读到的一行文本;context：负责把数据传给 Reducer
		protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
			// TODO (HELLO ,1)
            //把一行文本按空格切分成单词数组。
			String[] temps = value.toString().split(" ");
            //遍历每个单词,输出：(单词，1)
			for (String temp : temps) {
				//(key,value)
				context.write(new Text(temp), new IntWritable(1));
			}
		}
	}

	/*
	 * Reducer类
	 *输入类型 必须和 Mapper 输出完全一致。
	 */
	public static class ReduceTask extends Reducer<Text, IntWritable, Text, IntWritable> {
		@Override
        //key：某个单词（如 hello）;values：这个单词对应的所有 1（如 [1,1]）
		protected void reduce(Text key, Iterable<IntWritable> values, Context context)
				throws IOException, InterruptedException {
			// TODO (hello ,(1,1,1))
			int sum = 0;
            // 把所有 1 加起来 = 单词出现总次数
			for (IntWritable temp : values) {
				sum = sum + temp.get();
			}
            //输出最终结果：单词 次数
			context.write(key, new IntWritable(sum));
		}
	}

	/*
	 * Driver 类
	 */
	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf);
		job.setMapperClass(MyMapperTask.class);// 这里写的是我们的自定义Map方法名
		job.setReducerClass(ReduceTask.class);// 自定义Reduce方法名
		job.setJarByClass(WordCount.class);// 这里写的是主类
		job.setMapOutputKeyClass(Text.class);// Map输出时候key的类型
		job.setMapOutputValueClass(IntWritable.class);// Map输出时候value的类型
		job.setOutputKeyClass(Text.class);// 这是输出时候的key类型
		job.setOutputValueClass(IntWritable.class);// 这是输出时候的key类型
		FileInputFormat.setInputPaths(job, new Path("D:\\test1\\"));// 文件存放的位置一定要有
		FileSystem fs = FileSystem.get(conf);
		Path paths = new Path("D:\\test1\\demo");
		// 判断一下是否有这个文件夹有则删除
		if (fs.exists(paths)) {
			fs.delete(paths, true);
		}
		FileOutputFormat.setOutputPath(job, paths);// 文件输出的位置一定不能有
		// 为了方便测试
		boolean b = job.waitForCompletion(true);
		System.out.println(b ? "老铁，没毛病！！！" : "出BUG了，赶快去看一看咋回事！！！");
	}

}

```



<div style="max-width: 100%; overflow-x: auto;">
| 列1 | 列2 | 列3 | 列4 | 列5 | 列6 | 列7 | 列8 |
|-----|-----|-----|-----|-----|-----|-----|-----|
| 数据 | 数据 | 数据 | 数据 | 数据 | 数据 | 数据 | 数据 |
</div>