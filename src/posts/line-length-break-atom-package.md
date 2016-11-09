---
title: Line Length Break Atom Editor Package
date: 2014-09-15
---

I moved my Blog from a [Ghost](https://ghost.org/) setup to a
[custom](https://github.com/mustardamus/akrasia) setup and faced a little
problem when porting over the couple of posts that I've already written.

When written in Ghost the Markdown formatted posts are nicely aligned in the
editor, but once copied over to a normal text editor there are no line breaks
anymore.

I could've edited them by hand and moved on with my life. But eyyy, really,
by hand?!

## Atom Editor

Another change I did a few weeks ago was from [Sublime Editor](http://www.sublimetext.com/)
to [Atom Editor](https://atom.io/) from
the folks over at GitHub. The main reason was that Atom is open-source and
entirely written in JavaScript. If I would want to, I could hack on it.

Because I haven't found a Package that is doing what I wanted to do, breaking the
lines after a certain amount of characters, the time has come.

## Resources

Since this code is a no-brainer, I only used these resources to get started:

  - [Creating Packages](https://atom.io/docs/v0.127.0/creating-a-package)
  - [Create Your First Package](https://atom.io/docs/v0.127.0/your-first-package)
  - [Editor API Documentation](https://atom.io/docs/api/v0.127.0/Editor)

## The Code

Naturally, this hack is not perfect. It breaks everything before the preferred
line length, even if it break a Markdown link, for example. But it got the
job done and saved myself time.

```coffeescript
module.exports =
  activate: (state) ->
    atom.workspaceView.command 'line-length-break:break', => @breakLines()

  breakLines: ->
    editor     = atom.workspace.getActivePaneItem()
    lines      = editor.buffer.cachedText.split('\n')
    length     = atom.config.settings.editor.preferredLineLength or 80
    newContent = []

    for line in lines
      if line.length > length
        words    = line.split(' ')
        newLines = []
        tmpLine  = []

        for word in words
          tmpLineStr = tmpLine.join(' ')

          if tmpLineStr.length + word.length + 1 > length
            newLines.push tmpLineStr
            tmpLine = [word]
          else
            tmpLine.push word

        newLines.push tmpLine.join(' ')

        for line in newLines
          newContent.push line
      else
        newContent.push line

    editor.selectAll()
    editor.insertText newContent.join('\n')
```

Find the whole [code on GitHub](https://github.com/mustardamus/line-length-break)
and the
[package on Atom.io](https://atom.io/packages/line-length-break).
