Set-Location -LiteralPath $PSScriptRoot
$out = npm install 2>&1
$out | Out-File -FilePath "$PSScriptRoot\_npm_install.log" -Encoding utf8
Write-Output "EXIT: $LASTEXITCODE"
Write-Output ($out | Select-Object -Last 20)
