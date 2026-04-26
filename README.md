<h1 style="text-align:center">Doge 漫画</h1>

一款为有道词典笔 OS 设计的第三方漫画阅读器程序，使用 Vue.js 构建

此项目系我整的抽象大活，请勿质疑它发明出来的意义

## 特性

- 适配各型号词典笔屏幕的响应式设计
- 无依赖性，无需编译作业
- 本地文件浏览支持
- 自由放缩图片大小
- 阅读进度自动保存

## 预览

![index](https://cdn.mmoe.work/public/doge-comic/index.png)
![reader](https://cdn.mmoe.work/public/doge-comic/reader.png)

## 安装

### 直接安装

1. 首先确保你已经能够访问词典笔的 adb，否则请先按照
[听秋念的教程](https://www.bilibili.com/read/cv40931661/?plat_id=35&share_from=article&share_medium=iphone&share_plat=ios&share_source=QQ&share_tag=s_i&timestamp=1741365791&unique_k=3UbJ6rn&opus_fallback=1)
获取 adb 权限

2. 在 [releases](https://github.com/adogecheems/doge-reader/releases) 页面下载最新版本的安装包

3. 连接词典笔的 adb（教程中有写），并将 .amr 安装包文件 push 到词典笔 `/userdisk` 任意目录下（其实你在词典笔的 mtp 文件夹把文件直接拖进去也行...）

```bash
adb push <你安装包的路径/>all.amr /userdisk/Favorite/
```

4. 使用adb运行如下命令安装程序

```bash
adb shell "miniapp_cli install /userdisk/Favorite/all.amr" # 也可以是你自己选的路径
```

5. 你现在应该可以在桌面看见 Doge 阅读的粉色图标

### 从源码编译安装

老实讲意义不大。

1. 克隆项目存储库到本地

```bash
git clone https://github.com/adogecheems/doge-reader.git
```

2. 安装依赖

```bash
npm install
```

3. 编译项目

```bash
npm run build:prod
```

#### 关于Node.js版本

由于框架本身的缺陷，如果你的本机node版本为22或更高，可能会在构建时出现如[#4](https://github.com/adogecheems/doge-calculator/issues/4)所示的错误。解决方法是使用nvm切换到node 16|18|20版本，或者直接安装一个较旧版本的node。

编译完成后，在项目根目录下会出现 amr 文件，按上文一样操作即可安装

## 使用说明

- 本阅读器支持渲染单张图片与图片文件夹，将图片文件导入词典笔后即可通过`本地文件`访问
- 受限于框架，阅读器只能渲染JPEG、PNG、GIF、BMP这几种文件格式，不支持WEBP
- 图片文件命名的最佳实践是使用数字编号，否则可能不按正确顺序渲染
- 如果进度恢复时位置不正确，请尝试适当调大设置中的`渲染同步时间`

## 关于

作者：adogecheems  
许可证：AGPLv3

"Doge" 是“词典笔 OS 通用生态系统”的意思 (Dictpen OS Generic Ecosystem) 🐶

如果对你有什么帮助，请给我一个 star ⭐️～
