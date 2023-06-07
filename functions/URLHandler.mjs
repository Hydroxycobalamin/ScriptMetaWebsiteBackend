function GetProjectNameFromUrl(url) {
    const urlParts = url.split("/");
    return urlParts[4];
}

function GetProjectPathFromUrl(source) {
    if (source.startsWith("https://github")) {
        return source.slice(0, -".zip".length).replace("/archive/", "/blob/");
    }
    return `${source}`;
}

function GetFileSource(filePath, url, ln) {
    var selector = "-" + url.substring(url.lastIndexOf("/") + 1, url.length);
    var path = url + filePath.substring(filePath.indexOf(selector) + selector.length) + "#L" + ln;
    return path.replace(/\\/g, "/");
}

export { GetProjectNameFromUrl, GetProjectPathFromUrl, GetFileSource }