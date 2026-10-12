People assume I rooted my phone to get a custom status bar color. I didn't. I rooted it because I'd been *describing* how Android boots for months and I wanted to be able to *watch* it.

Rooting turned out to be a reading assignment. Here's what the assignment covered.

## The boot chain, finally visible

With adb, the boot sequence is a black box with a few peeking holes. With root, it's an open book. The chain, in the order it actually happens:

1. **Bootloader** — verifies the signed image and hands off to the kernel
2. **Kernel + init** — mounts `/system`, starts the first processes
3. **zygote** — the parent of every Java process; this is where app isolation is born
4. **system_server** — the kitchen sink of Android: activity manager, window manager, all of it
5. **Launcher** — the first thing you see, arguably the least important part

The moment I could read `/sys`, kernel logs, and property files with real permissions, three years of "it's probably how it works" turned into "here is how it works, with line numbers."

## What root actually changed

- **Magisk** patched the boot image — my system partition is still byte-identical to stock. "Systemless" is the whole game.
- A new world appeared under `/data/adb`: modules, policies, service scripts.
- **SELinux** stopped being a wall and became a thing with a configuration. Understanding `enforcing` vs `permissive`, and why you should almost never ship `permissive`, was the single biggest lesson.

```bash
# the command that changed my relationship with the phone
adb shell
su
dmesg | grep -i verity
```

## The costs, honestly

I'd rather list the downsides up front:

- **Play Integrity** drops to a lower level. Some banking apps stopped working. I accept that.
- **OTA updates** can break if you're lazy. Magisk has to survive each update, and "survive" sometimes means re-doing the patch by hand.
- A rooted phone is a *responsibility*. Stock Android is a product; a rooted one is a system you operate.

The trade feels fair. A product is a promise someone else keeps. A system is a promise I keep.

## What I'd tell someone considering it

Don't root to remove ads. Root to ask questions — because root is the difference between guessing and knowing. If after a week you haven't read a boot log, you didn't need root; you needed a better wallpaper.

Next in this series: how Magisk modules actually hook into the boot process, without the folklore.
