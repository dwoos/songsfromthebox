#/usr/bin/env bash

echo "songs=["

for song in songs/*.cho; do
    printf '{"slug": "%s",' $song
    printf '"song": `'
    cat $song
    printf '`},'
done
echo "]"
