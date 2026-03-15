exports('takeServerScreenshot', function(playerSrc, path, options, timeout)
    local p = promise.new()

    exports['scloud-sdk']:__takeServerScreenshot(playerSrc, path, options or {}, timeout or 10000, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)

exports('requestPresignedUrl', function(path, options)
    local p = promise.new()

    exports['scloud-sdk']:__requestPresignedUrl(path, options or {}, function(url)
        p:resolve(url)
    end)

    return Citizen.Await(p)
end)

exports('uploadImage', function(buffer, path, options)
    local p = promise.new()

    exports['scloud-sdk']:__uploadImage(buffer, path, options or {}, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)
