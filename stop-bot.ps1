$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
    Where-Object { $_.CommandLine -match 'index\.js' }

foreach ($p in $procs) {
    Write-Host "Stopping PID $($p.ProcessId): $($p.CommandLine)"
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
}

if (-not $procs) {
    Write-Host "No running bot process found."
}
