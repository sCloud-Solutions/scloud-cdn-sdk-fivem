exports('takeServerScreenshot', function(playerSrc, options)
    local p = promise.new()
    local opt = options or {}

    exports['scloud-sdk']:__takeServerScreenshot(playerSrc, opt, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)

exports('requestPresignedUrl', function(options)
    local p = promise.new()
    local opt = options or {}

    exports['scloud-sdk']:__requestPresignedUrl(opt, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)

exports('uploadImage', function(buffer, options)
    local p = promise.new()
    local opt = options or {}

    exports['scloud-sdk']:__uploadImage(buffer, opt, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)
