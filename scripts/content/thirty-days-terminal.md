On the first of the month I deleted my desktop environment's autostart, my dock, and my shortcuts. For 30 days I lived in tmux on a bare Wayland session. This is the damage report — and, surprisingly, the gains.

## The plan (and how it immediately failed)

Day 1: confident. Day 2: I couldn't find my terminal settings file. Day 3: the DNS incident (below). Day 4: I wrote a script to do what the GUI used to, and it was *better*.

By day 10 the terminal stopped being a tool I visited and became a room I lived in.

## What actually stuck

**tmux as the operating surface.** Three panes: work, logs, chat. Sessions named after projects, resurrected on every boot:

```bash
tmux new -s build
tmux new -s net
# weeks later, on a reboot:
tmux attach -t build   # everything exactly where I left it
```

**journalctl as a habit.** The moment I started reading `journalctl -f` while things ran, I stopped debugging by feeling and started debugging by watching.

**systemd for the personal infrastructure.** My music server, my backups, my sync — all one-liners now:

```ini
[Service]
ExecStart=/usr/local/bin/music-server --port 8090
Restart=on-failure
RestartSec=3
```

That's an "always-on service." No tray icons, no forgot-to-restart mornings.

## The DNS day

Day 9, my resolver cached a bad record and half the network "died." In a GUI world I would have restarted the router twice and posted a confused question online. Instead:

1. `resolvectl status` — saw the stale cache
2. `resolvectl flush-caches` — fixed in 4 seconds
3. Wrote this blog post, because now I *know*

That day was the whole experiment in miniature: the terminal doesn't remove the problem, it removes the *black box*.

## Privacy, measured

With nothing autostarting, I audited what actually left the machine during the month: package updates, my own web requests, DNS. That's it. The list is short enough to fit in one terminal line, and I can name the process for every line.

```bash
# my daily 30-second privacy check
ss -tnp | sort -u
```

## What I'd keep, even going "back"

- tmux sessions (non-negotiable now)
- The habit of reading logs live
- systemd units for anything that should "just run"
- Knowing, concretely, what my machine does when I'm not looking

> You don't need to live in the terminal to get the benefit. You need to *trust* it enough to look. The looking is the point.

The GUI came back on day 31. It's quieter now, because I know what's under the carpet.
