# haxStatsDashBoard

A dashboard app made with React Native, meant to monitor current ongoing and past games,
record specific game events and presenting them in a visually pleasing manner.

## Demo

A version of this dashboard is hosted by Expos services under the following link:
[https://haxstats.expo.app/](https://haxstats.expo.app/)

![Screenshot 2025-03-28 at 16 24 41](https://github.com/user-attachments/assets/bffc2801-5994-4726-b199-7a15ecdb25f1)

    


### Technologies Used

    react-native
    Expo
    React Native server components
    Supabase
    

## How it works:

This dashboard works in cohesion with the accompanying Haxball game server. 
That servers git repo can be found under [this link](https://github.com/asko328P/haxNodeServer)
The game server is sending specific events to a Supabase project and is storing them in a 
relational database. Then, this data can be queried by this dashboard and presented,
giving the user the option to view more specific statistics related to a player

### In detail

The dashboard will initially load the landing page, then server components are taking
over and fetching data from Supabase. Because the server is the component that is fetching the data,
we don't need to worry about exposing confidential keys to the public. Client components are then
taking over and are presenting the data, allowing us to use functionality that are exclusive
to the client such as React hooks.
