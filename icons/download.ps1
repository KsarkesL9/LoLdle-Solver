# ===============================================
# Pobieranie ikon championów League of Legends
# z CommunityDragon + mapowanie ID → alias
# ===============================================

# 1) URL-e
$champBaseURL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/'
$iconBaseURL  = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/'

Write-Host ">>> Pobieram mapę championów z $champBaseURL ..."

# 2) Pobranie listy plików championów (.json)
$resp = Invoke-WebRequest -Uri $champBaseURL
$ids = [regex]::Matches($resp.Content, 'href="([^"]+\.json)"') |
       ForEach-Object { ($_.Groups[1].Value -replace '\.json$','') -as [int] }

# 3) Budowa mapy ID → alias
$idMap = @{}
foreach ($id in $ids) {
    $jsonUrl = "$champBaseURL$id.json"
    try {
        $champ = Invoke-WebRequest -Uri $jsonUrl -UseBasicParsing | ConvertFrom-Json
        $idMap[$id] = $champ.alias
    } catch {
        Write-Warning "Nie udało się pobrać championa z ID $id"
    }
}
Write-Host ">>> Znaleziono $($idMap.Count) championów."

# 4) Pobieranie ikon
Write-Host ">>> Pobieram ikony z $iconBaseURL ..."
$imgResp = Invoke-WebRequest -Uri $iconBaseURL
$imgMatches = [regex]::Matches($imgResp.Content, 'href="([^"]+\.png)"')

# Utwórz folder "icons", żeby nie bałaganić
$destDir = Join-Path (Get-Location) "icons"
if (-not (Test-Path $destDir)) {
    New-Item -Path $destDir -ItemType Directory | Out-Null
}

foreach ($m in $imgMatches) {
    $file = $m.Groups[1].Value
    $id = [int]($file -replace '\.png','')

    $alias = if ($idMap.ContainsKey($id)) { $idMap[$id] } else { "unknown_$id" }
    $dest = Join-Path $destDir "$alias.png"

    try {
        Invoke-WebRequest -Uri ($iconBaseURL + $file) -OutFile $dest -UseBasicParsing
        Write-Host "Pobrano: $alias.png"
    } catch {
        Write-Warning "Błąd pobierania ikony ID $id"
    }
}

Write-Host ">>> Gotowe! Ikony zapisane w: $destDir"
