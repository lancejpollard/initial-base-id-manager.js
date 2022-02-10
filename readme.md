
# Initial Base ID Manager

Keeps track of the GUID for the created hosts and decks for now.

In theory this will be done in link text in the lock file behind the scenes, with manual intervention only necessary on edge cases like renaming a deck if you don't use the deck rename command.

Don't want to use UUIDv4 because (a) they are quite long and (b) they are not actually _universally unique_, there's a probability, however small, that you will have a collision. And if that's the case, you need to double check that the UUID hasn't been used before. So might as well just keep track of the IDs in a central server, to keep them short and clean, and to prevent theoretical collisions.

```bash
node index generate
node index generate host drumwork
node index generate deck drumwork/work
node index generate deck drumwork/dock
node index generate deck drumwork/base
```

```json
{
  "host": {
    "salt": "7438626736786884082",
    "mark": {
      "head": "256",
      "list": [
        {
          "base": "1",
          "size": "255"
        }
      ]
    },
    "list": {
      "drumwork": {
        "mark": "7837397760867793543",
        "deck": {
          "salt": "4313616192412195232",
          "mark": {
            "head": "256",
            "list": [
              {
                "base": "3",
                "size": "253"
              }
            ]
          },
          "list": {
            "work": {
              "mark": "1563498321738253212"
            },
            "dock": {
              "mark": "9745245934914831858"
            },
            "base": {
              "mark": "2454468045264276270"
            }
          }
        }
      }
    }
  }
}
```
