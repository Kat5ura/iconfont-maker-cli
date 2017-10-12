# iconfont-maker-cli

A CLI tool base on iconfont-maker

## Install 

```shell
npm i -g iconfont-mkaer-cli
```

Usage

```shell
Usage: iconfont [command] [options]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    make [from] [to]  Generate iconfonts base on given svg-icon images
    help [cmd]        display help for [cmd]

Usage: iconfont make [from] [to] [options]

  Make your own IconFont from svg icons

  Options:

    -c, --config <c>     Use a config file
    -n, --font-name <n>  Specify a custom font name
    -s, --css            Generate css file, true by default
    -d, --css-dest <d>   Specify a custom destination for css file
    -H, --html           Generate an html file for test
    -D, --html-dest <d>  Specify a custom destination for html file
    -t, --types <t>      Font types to generate, default is [woff2, woff, eot]
    -o, --optimize          Enable svg optimization with svgo, default is true
    -P, --svgo-plugins <l>  Plugins list for svgo, "plugin1,!plugin2", use "!" to turn off
    -h, --help           output usage information

  Examples:

    # Make your own iconfonts
    $ iconfont make ./icons/*.svg ./fonts/


```

## License

MIT