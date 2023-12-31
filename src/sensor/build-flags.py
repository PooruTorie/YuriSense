import json

Import("env")

device_type = None
version = None

with open("config.json", encoding="UTF8") as config:
    config = json.load(config)
    useOta = config["ota"]
    if useOta:
        env.Replace(UPLOAD_PROTOCOL="espota")
    for key in config:
        value = config[key]
        key = key.upper()
        if key.replace("_STR", "") == "VERSION":
            version = value
        if type(value) == str and (not value.isnumeric() or key.endswith("_STR")):
            value = "\\\"" + value + "\\\""
        if type(value) == bool:
            if value:
                value = "1"
            else:
                continue
        if type(value) == dict:
            continue
        env.Append(BUILD_FLAGS=["-DCONFIG_%s=%s" % (key.replace("_STR", ""), value)])
        if key == "DEVICE_TYPE":
            device_type = config["device_types"][str(value)]
            env.Append(BUILD_FLAGS=["-DCONFIG_DEVICE_TYPE_NAME=\\\"%s\\\"" % device_type])
        if useOta:
            if key == "OTA_PASSWORD":
                env.Append(UPLOAD_FLAGS=["--auth=%s" % value])
            if key == "OTA_IP":
                env.Replace(UPLOAD_PORT=value)


env.Replace(PROGNAME="yurisense_%s_%s" % (device_type, version))

print(env.Dump())
