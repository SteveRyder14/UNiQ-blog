I don't want my listening habits to be a data point. So I built a tiny server that streams my FLAC collection around the apartment — for less than the cost of one album.

## The hardware

An old mini PC that died a "useful" death years ago: 4 cores, 16GB RAM, a fan that's still somehow working. It draws about 8 watts idle. The alternative — the streaming service — costs more per month than this box drew in electricity over its entire second life.

## The stack

Deliberately small. No framework bigger than the problem:

- A **Python web server** (Flask, one file, ~300 lines) that serves the library
- Music stored as plain FLAC files in a directory tree — the *folder structure is the database*
- Cover art and metadata read from the tags at request time, so reorganizing folders is the whole "curation system"

```
~/music/
  Field Recordings/
    01 morning static.flac
    02 iron and rain.flac
  ...
```

The browser player is 120 lines of vanilla JS around the `<audio>` element. It remembers your position per track in localStorage. That's the feature set. It's enough.

## The network details that mattered

- **Gapless-ish playback**: HTTP range requests let the player buffer the next track's first second before the current one ends. Nobody notices a 1-second overlap.
- **The TV**: DLNA. I didn't write it — a small off-the-shelf responder publishes the library, and the TV just sees "a folder." It works, which is the highest compliment I can give it.
- **Latency**: on the LAN, the first note lands in under 150ms. It's not CD. It's better than CD, because the files are lossless.

## What it taught me about "streaming"

Streaming a song to your own living room is: one socket, a few bytes of header, and a long chunked transfer. The entire edifice of "music streaming" — the catalogs, the recommendations, the listening graphs — is built on top of this 150ms handshake, with a business model welded onto it.

Remove the business model and what's left is *calm*:

- No skip limits
- No "your listening stats"
- A library that survives every service shutdown, because it lives on a disk I own

> Ownership is a latency feature. The fastest path to a song is the one that starts in your own directory.

## The budget line

- Mini PC: $0 (dead box, resurrected)
- Storage: 1TB used drive, $25
- Total: **$25 for a lifetime of gapless, lossless, zero-tracking music**

Next post on this thread: the gapless overlap hack in detail, because "nobody notices" turns out to be a small number of very specific milliseconds.
