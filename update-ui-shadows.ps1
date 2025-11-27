# PowerShell script to replace border classes with shadow classes across all pages

$appPath = "c:\Users\Bruce\Documents\My Projects\Ready\mining_erp\app"

# Define replacement patterns
$replacements = @{
    'className="border rounded px-2 py-1"' = 'className="input-shadow rounded px-2 py-1 bg-white"'
    "className='border rounded px-2 py-1'" = "className='input-shadow rounded px-2 py-1 bg-white'"
    'className="border rounded px-2 py-1 w-32"' = 'className="input-shadow rounded px-2 py-1 w-32 bg-white"'
    'className="border rounded px-2 py-1 w-64"' = 'className="input-shadow rounded px-2 py-1 w-64 bg-white"'
    'className="w-full text-left border"' = 'className="w-full text-left table-shadow"'
    'className="border-t"' = 'className="row-shadow"'
    'className="rounded border px-2 py-1"' = 'className="rounded shadow-sm hover:shadow-md px-2 py-1"'
}

# Get all .tsx files
$files = Get-ChildItem -Path $appPath -Filter "*.tsx" -Recurse

$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles files to process..."

foreach ($file in $files) {
    $processedFiles++
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Apply all replacements
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $content = $content -replace [regex]::Escape($pattern), $replacement
    }
    
    # Save if changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Modified: $($file.Name)"
    }
    
    if ($processedFiles % 10 -eq 0) {
        Write-Host "Progress: $processedFiles/$totalFiles files processed..."
    }
}

Write-Host "`nCompleted!"
Write-Host "Total files processed: $totalFiles"
Write-Host "Files modified: $modifiedFiles"
