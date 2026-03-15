exports('takeScreenshot', function(options)
    local p = promise.new()

    exports['scloud-sdk']:__takeScreenshot(options or {}, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end)