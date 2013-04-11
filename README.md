REQUEST
    POST torrent-forge/torrent
        body: urls
RESPONSE
    return 200 (OK)             -> Torrent ID


REQUEST
    GET torrent-forge/torrent/id
RESPONSE
    return 202 (Accepted)       -> Generating
    return 200 (OK)             -> Torrent File
    return 400 (Bad Request)    -> Invalid ID
    return 410 (Gone)           -> Creation Failed
