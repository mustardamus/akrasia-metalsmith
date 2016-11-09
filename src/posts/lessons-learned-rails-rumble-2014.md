---
title: Lessons learned at Rails Rumble 2014
date: 2014-10-27
---

Once again I competed in the 48 hour coding competition called
[Rails Rumble](railsrumble.com). It must have been my 5th. Although I didn't
win, it was a success in my opinion. But there are some things I definitely
want to do better next year. Here are some thoughts I like to note and share...

<iframe width="560" height="315" src="//www.youtube.com/embed/qxrM71KhD9U" frameborder="0" allowfullscreen></iframe>

## Better preparation

I wasn't really prepared. I settled with an idea two days before the competition.
And on this two days I barely did any technical planning. I only roughly thought
about which steps are needed to get to my goal.

On Saturday, 12 hours or so in the competition, I haven't written a single line
of code. Instead, I spent the afternoon in the English woods hiking. It was
beautiful weather, so I did my planning outside. And I really thought it
through. In the evening I went back to my place and started hacking, and it
went pretty smoothly because I visualized what to do for hours.

Next time I want to do that kind of planning before the competition. So I got
actually more time writing code.

## Don't start with user authentication

First thing I did was implementing the user authentication via
[omniauth-github](https://github.com/intridea/omniauth-github). It was very easy
to implement. But next year I want to do this at the end of the competition for
two reasons: 1) You have to provide anonymous usage of your app, which is way
more appealing for people to try it out, and 2) you have more time getting more
important things done. If the user authentication isn't implement, whatever,
it's a hackathon.

## Better presentation

I believe at least 70% of successful contest entries is about presentation. The
rest is about that it does work smoothly, is easy to use and only very little
is about the actual code you write. So next time, when I start planning before,
I also want to think about the layout, design and writing of my application. I
should even start putting together the markup and style it first.

## Get to know your stack

In this years Rumble you had to use [Heroku](https://www.heroku.com/) to deploy
your app. I used it before in a [Node Knockout](http://nodeknockout.com/)
contest, but that was the only time and years ago. It's a push and deploy
service. It worked pretty smoothly in the beginning, but turned out to be
a headache when I tried to get [FFmpeg](http://ffmpeg.org/) with
[Vorbis](https://www.xiph.org/vorbis/) support installed. Basically I trashed
my stack while trying it, I've spent at least an hour to fix it. In the
end I just put statically linked binaries in the repo, which I've pushed to the
server. I hope my mom doesn't see this.

Next time, if I have only one option to use, I make sure to be familiar with
the service and how to get 3rd party applications installed. But really, I just
hope next time you can use a VPS.

## Vue.js is awesome

Although it's called *Rails Rumble*, I didn't use Rails at all. I used
[Sinatra](http://www.sinatrarb.com/) as my backend, and very little of that.
Most of the things happened on the front-end.

I just started using [Vue.js](http://vuejs.org/), which is a MVVM web-framework.
It was love on first sight, and I deepened the relationship on that hackathon
weekend. I'm really looking forward to create more kewl stuff with it. I am
already working on it...
