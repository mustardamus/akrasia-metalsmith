---
title: Banned Twitter Auto-Follow Application in Node.js
date: 2016-02-11
---

## Prolog

Pre-2010, when Twitter was still up and coming, I started a account named
[@usejquery](https://twitter.com/usejquery) to tweet about the "latest and
greatest about jQuery". When it was still the Wild West on Twitter, I coded
a auto-follower based on searches with Ruby. It really was a simple script I've
never dared to release. However, in the time that I managed the account (before I
sold the UsejQuery website and Twitter account), I was able to gather just over
23k in followers. Today it has over 58k followers.

Of course, blindly following people in your niche does not work by itself. You
need to put out new content on a daily basis and engage with your followers.
That was the success formula to become one of the biggest Twitter accounts about
jQuery.

## Fast forward

It's 2016 - Twitter, as we all know, grew to one of the biggest social
platforms out there. And of course there is a lot of abuse on the platform in any
form. "Auto-Following" is one of them. In fact, automation of any kind. Bots are
simply not welcome - still there are a tons of bots on there,
[23 million in 2014](http://www.techtimes.com/articles/12840/20140812/twitter-acknowledges-14-percent-users-bots-5-percent-spam-bots.htm).
And it's not surprising why: when there is the possibility to automate repeating
tasks, coders will do that. It's in their nature.

Out of curiosity I wanted to re-create my little Ruby script from 2009, but with
the "modern" stack I were using: Vue.js, MongoDB and Node.js. At the time I was
working on a Yeoman Generator called
[Grail](https://github.com/mustardamus/generator-grail). To code a real-world
application alongside the boilerplate I chose to code a Twitter auto-follower
yet again. I was aware of Twitter's rules, but thought "fuck it" and did it
anyway. "Do it anyway" and "find out" is in my nature after all.

## Screenshots

![](/assets/images/followng2.png)
![](/assets/images/followng3.png)

## Features

- Using all parts of the [Grail Generator](https://github.com/mustardamus/generator-grail)
- User registration
- Add multiple Twitter accounts for a User
- Add multiple search terms for each Twitter account
- Set different options for Twitter accounts
- Continues workers for following/unfollowing/searching
- Coded entirely in CoffeeScript (Front- and Backend)
- Uses Vue.js, Sematic-UI, MongoDB, Express.js, Node.js and more
- Forbidden fruit ;)

## The Code you are not allowed to use

So, the badass I am, I ran the app on my server for two months before
this happened:

![](/assets/images/followng1.png)

Of course it was clear to me that this will happen, I just wasn't sure how long
it would last before the Twitter-App got shot down. Now we know.

Was it worth it? Yes, it was fun to develop it and to let it run as long as it
was allowed. I see it as an coding exercise. And you should too: take a look at
it and maybe learn a thing or two. But you shouldn't mind to set it up yourself,
as it will be eventually banned too.

Anyway, here is the GitHub Repository. Have fun!

### [Follow-ng GitHub Repository](https://github.com/mustardamus/follow-ng)
