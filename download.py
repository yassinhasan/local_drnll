import datetime
import yt_dlp


def FilterData(ctx):
    title = ctx["title"]
    thumbnail = ctx["thumbnail"]
    duration = str(datetime.timedelta(seconds=ctx["duration"]))  
    formats = ctx["formats"]
    videosFormat = [f for f in formats if (f["vcodec"] != "none" and f["acodec"] != "none")]
    audiosFormat = [f for f in formats if (f["vcodec"] == "none" and  "acodec" in f and f["acodec"] != "none")]

    videosFormatFiltered = []
    audiosFormatFiltered = []

    for v in videosFormat:
        a = dict()
        a["filesize"] = v["filesize"] if v["filesize"]!=None else v["filesize_approx"]
        a['filesize'] = str(round((int(a['filesize'])/1024/1024),1)) + "MB"
        a["url"] = v["url"]
        a["resolution"] = v["resolution"].split("x")[1]
        a["ext"] = v["ext"]
        videosFormatFiltered.append(a)

    for v in audiosFormat:
        a = dict()
        a["filesize"] = v["filesize"] if v["filesize"]!=None else v["filesize_approx"]
        a['filesize'] = str(round((int(a['filesize'])/1024/1024),1)) + "MB"
        a["url"] = v["url"]
        a["ext"] = v["ext"]
        a["abr"] = v["abr"]
        a["abr"] = str(int(a["abr"])) + "Kbps"
        audiosFormatFiltered.append(a)

    return {
        'title': title,
        'thumbnail': thumbnail,
        'videos' : videosFormatFiltered,
        'audios' : audiosFormatFiltered,
        'duration' : duration,
    }


def GetDownloadOptions(url):
    ydl_opts = {
        "format" : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
    }
    info = ""
    baseData = ""
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        baseData=FilterData(info)
    return baseData

# def extract_format_data(format_data):
#     extension = format_data["ext"]
#     format_name = format_data["format"]
#     url = format_data["url"]
#     filesize = format_data[format_name]["filesize"] if format_data['filesize'] != None else "ds"
#     print(filesize)
#     return {
#         "extension": extension,
#         "format_name": format_name,
#         "url": url ,
#         "filesize" : filesize
#     }
# def GetDownloadOptions(url):
#     ydl_opts = {
#         "format" : "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
#     }
#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         video_data = ydl.extract_info(url, download=False)

#     title = video_data["title"]
#     formats = video_data["formats"]
#     thumbnail = video_data["thumbnail"]
#     duration = str(datetime.timedelta(seconds=video_data["duration"]))
    
#     results = [extract_format_data(format_data) for format_data in formats]
#     return {
#         "title": title,
#         "formats": results,
#         "thumbnail": thumbnail,
#         "duration": duration,
#     }


