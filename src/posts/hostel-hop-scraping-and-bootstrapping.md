---
title: Hostel Hop Day 1 + 2 - Scraping and bootstrapping data
date: 2014-02-14
---

The first thing we did for our [static showdown entry](http://www.staticshowdown.com/app/teams/ed340284e574310eaa4c1d349eb23b54/entry)
was to scrape some initial data. I felt very comfortable bootstrapping the app
with real data. So for the real thing, I do it again.

For the contest, we scraped [hostels.com](http://www.hostels.com/). For the
actual app I switched to [hostelworld.com](http://www.hostelworld.com/) since
this platform has more information that could proof important in the future.

### Insert hostels to MongoDB

I don't want to show the Ruby code I used to scrape the actual data, because it
would be embarrassing :). Since this is a job to be done just once, I produced
shitty code that get it done fast.

Anyway, each hostel is inserted in a [MongoDB](http://mongodb.org/). Here is the
[Mongoid](http://mongoid.org/en/mongoid/index.html) model declaration:

```ruby
class Hostel
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Versioning

  field :name, type: String, default: ''
  field :link, type: String, default: ''
  field :address, type: String, default: ''
  field :city, type: String, default: ''
  field :country, type: String, default: ''
  field :rating, type: Integer, default: 0
  field :reviews, type: Integer, default: 0
end
```

Now I got quite a few hostels and basic information about them from around the
world. Since they are inserted in a database it is pretty easy to work with
them.

How many exactly?

```
❯ mongoexport --db hostelhop_v1 --collection
hostels --out hostels.json
connected to: 127.0.0.1
exported 7602 records
```

Feel free to [download the hostels.json (11mb)](https://mega.co.nz/#!mc1BSLgK!0JKuivFlWtlhlisa6t6sWqhzEmRyTcFgtDrFxa15tKI)
and play around with it.

### Generating JSON files

Now that I have the hostels in a MongoDB, I could code my app that it reads the
data from there. But that would be extra work that is not really necessary in
the early stage of the app. Also, I got over 7000 entries. Nah, I'd rather start
with a smaller number of bootstrapped data.

With the following Ruby script, I select only the best of the best hostels.
Still almost 500. Then I write it in separate JSON files, one for each country.
Also I save a index of countries and cities that will be the entry point for my
app.

```ruby
require 'json'
require 'mongoid'

root_path = File.expand_path(File.dirname(__FILE__))
Mongoid.load!("#{root_path}/mongoid.yml", :development)
require "#{root_path}/Hostel.rb"

count = 0
hostels = {}
countries = {}

Hostel.each do |hostel|
  next if hostel.rating < 97 && hostel.reviews < 2000

  obj = { name: hostel.name, address: hostel.address, city: hostel.city, country: hostel.country }

  if hostels[hostel.country]
    hostels[hostel.country].push obj
  else
    hostels[hostel.country] = [obj]
  end
end

hostels.each do |country_name, hostels_arr|
  next if country_name.length == 0 || hostels_arr.length == 0

  hostels_arr.each do |hostel|
    if countries[country_name]
      unless countries[country_name].include?(hostel[:city])
        countries[country_name].push hostel[:city]
      end
    else
      countries[country_name] = [hostel[:city]]
    end
  end

  path = "#{root_path}/data/bootstrap/#{country_name}.json"
  File.open(path, 'w').write(hostels_arr.to_json)
  puts "Saved #{country_name}.json"
end

File.open("#{root_path}/data/bootstrap/countries.json",
'w').write(countries.to_json)
puts "Saved countries index"
```

Sweet! Now I got separated JSON files I could easily query with Ajax. Since I'll
use [Backbone.js](http://backbonejs.org/) anyway, this is the way to bootstrap
the data.
