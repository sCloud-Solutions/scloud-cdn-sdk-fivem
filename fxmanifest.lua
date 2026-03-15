fx_version "cerulean"
game "gta5"

author "0xSacul"
description "sCloud CDN SDK for FiveM"
version "1.0.0"
url "https://github.com/sCloud-Solutions/scloud-cdn-sdk-fivem"

client_scripts {
    "dist/client/index.js",
    "client.lua"
}
server_scripts {
    "dist/server/index.js",
    "server.lua"
}

exports {
    -- Client Internal
    "__takeScreenshot",
    
    -- Client Public
    "takeScreenshot",

    -- Server Internal
    "__takeServerScreenshot",
    "__requestPresignedUrl",
    "__uploadImage",

    -- Server Public
    "takeServerScreenshot",
    "requestPresignedUrl",
    "uploadImage"
}
