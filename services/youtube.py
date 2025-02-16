import datetime
import yt_dlp


def FilterData(info):
    title = info.get("title", "Unknown Title")
    thumbnail = info.get("thumbnail", "")
    duration = str(datetime.timedelta(seconds=info.get("duration", 0))) if info.get("duration") else "Unknown"
    formats = info.get("formats", [])

    videosFormat = [f for f in formats if f.get("vcodec") != "none" and f.get("acodec") != "none"]
    audiosFormat = [f for f in formats if f.get("vcodec") == "none" and f.get("acodec") != "none"]

    # Process videos and audios
    videosFormatFiltered = []
    audiosFormatFiltered = []

    for v in videosFormat:
        filesize = v.get("filesize") or v.get("filesize_approx", "Unknown")
        if filesize and isinstance(filesize, int):
            filesize = f"{round(filesize / 1024 / 1024, 1)}MB"
        a = {
            "filesize": filesize,
            "url": v.get("url", ""),
            "resolution": v.get("resolution", "Unknown").split("x")[-1],
            "ext": v.get("ext", "Unknown"),
        }
        videosFormatFiltered.append(a)

    for v in audiosFormat:
        filesize = v.get("filesize") or v.get("filesize_approx", "Unknown")
        if filesize and isinstance(filesize, int):
            filesize = f"{round(filesize / 1024 / 1024, 1)}MB"
        
        # Handle None value for abr (audio bitrate)
        abr = v.get("abr", 0)
        if abr is None:
            abr = 0  # Default to 0 if abr is None

        a = {
            "filesize": filesize,
            "url": v.get("url", ""),
            "ext": v.get("ext", "Unknown"),
            "abr": f"{int(abr)}Kbps",  # Ensure abr is an integer
        }
        audiosFormatFiltered.append(a)

    return {
        "title": title,
        "thumbnail": thumbnail,
        "videos": videosFormatFiltered,
        "audios": audiosFormatFiltered,
        "duration": duration,
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


