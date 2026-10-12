There's a lot of folklore around Magisk modules — magic, hex editing, the system "noticing." None of it is true, and all of it is worth dispelling, because once you know what a module *is*, you stop fearing them and start reading them.

## A module is a zip file

That's the whole secret. A module is a zip with a small contract:

```
module.prop        # name, version, author, the metadata
system/            # files merged into /system at boot
system.prop        # properties to add
service.sh         # runs after boot, as root
customize.sh       # optional: transform the system/ tree before merge
```

That's it. No compiler, no daemon in space. If a module does something you don't understand, you can unzip it on your PC right now and read every line.

## The boot sequence with a module present

1. Bootloader hands off to the patched boot image
2. Magisk's init stage loads and mounts `/data`
3. Each enabled module's `system/` tree is **merged** over the real system — an overlay, not a copy
4. `system.prop` entries are applied
5. System starts normally, then Magisk fires the module `service.sh` scripts
6. Reboot with the key combo → modules unmerge → your phone boots stock-clean

Step 6 is why "systemless" matters: your `/system` partition is never written, so OTA updates don't corrupt it, and you can always back out of a bad module the same morning.

## SELinux: the part everyone skips

Modules that touch system files get denied by SELinux unless the policy is extended. Magisk does this **temporarily** — it patches the policy in memory at boot. Reboot without Magisk and the policy reverts. This is also why a module can't silently persist beyond Magisk's lifetime: the policy it leans on doesn't exist outside of it.

```
# from a real service.sh — note the restraint
[ -f /data/adb/modules/mymodule/ok ] || exit 0
setprop mymodule.enabled true
```

## A practical checklist before enabling anything

- Unzip it. Read `customize.sh` and `service.sh`. Ten seconds saves a week.
- Prefer modules that touch **properties** over modules that **replace binaries**.
- One new module at a time. If the boot breaks, you know which one did it.
- Keep `logcat` open during the first boot after adding one. The log tells you everything the module's README won't.

> Rule of thumb: a good module is boring. It changes one thing, says what it changed, and undoes it cleanly.

The folklore exists because the boring explanation is less fun to screenshot. I find it the opposite — knowing exactly where a 100KB zip fits inside my boot chain is the most fun a zip file has ever been.
