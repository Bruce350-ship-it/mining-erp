# Fix Sidebar.tsx file - replace border-r with shadow-lg
$filePath = "c:\Users\Bruce\Documents\My Projects\Ready\mining_erp\components\Sidebar.tsx"

# Read file content
$content = Get-Content -Path $filePath -Raw

# Simple replacement: border-r -> shadow-lg
$content = $content -replace 'border-r', 'shadow-lg'

# Write back
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Fixed Sidebar.tsx: replaced border-r with shadow-lg"
