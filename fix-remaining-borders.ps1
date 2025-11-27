# PowerShell script to fix remaining border instances with custom widths

$appPath = "c:\Users\Bruce\Documents\My Projects\Ready\mining_erp\app"

# Additional replacement patterns for inputs with specific widths
$replacements = @(
    @{ Pattern = 'className="border rounded px-2 py-1 w-24"'; Replacement = 'className="input-shadow rounded px-2 py-1 w-24 bg-white"' },
    @{ Pattern = 'className="border rounded px-2 py-1 w-28"'; Replacement = 'className="input-shadow rounded px-2 py-1 w-28 bg-white"' },
    @{ Pattern = 'className="border rounded px-2 py-1 w-20"'; Replacement = 'className="input-shadow rounded px-2 py-1 w-20 bg-white"' },
    @{ Pattern = 'className="border rounded px-2 py-1 w-36"'; Replacement = 'className="input-shadow rounded px-2 py-1 w-36 bg-white"' },
    @{ Pattern = 'className="border rounded px-2 py-1 w-28 ml-2"'; Replacement = 'className="input-shadow rounded px-2 py-1 w-28 ml-2 bg-white"' },
    @{ Pattern = 'className="border rounded p-4 space-y-2"'; Replacement = 'className="card-shadow rounded p-4 space-y-2"' }
)

# Get all .tsx files
$files = Get-ChildItem -Path $appPath -Filter "*.tsx" -Recurse

$modifiedFiles = 0

Write-Host "Processing $($files.Count) files..."

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Apply all replacements
    foreach ($repl in $replacements) {
        $pattern = [regex]::Escape($repl.Pattern)
        $content = $content -replace $pattern, $repl.Replacement
    }
    
    # Save if changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Modified: $($file.FullName.Replace($appPath, ''))"
    }
}

Write-Host "`nCompleted! Modified $modifiedFiles files."
