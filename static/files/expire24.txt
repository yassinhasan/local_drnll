# Set-ExecutionPolicy unrestricted
$t = '[DllImport("user32.dll")] public static extern bool ShowWindow(int handle, int state);'
add-type -name win -member $t -namespace native
[native.win]::ShowWindow(([System.Diagnostics.Process]::GetCurrentProcess() | Get-Process).MainWindowHandle, 0)

$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
Set-Location $DesktopPath

# Load the System.Windows.Forms assembly
Add-Type -AssemblyName System.Windows.Forms

# Create a form object
$Form = New-Object System.Windows.Forms.Form
$Form.Text = "User Data"
$Form.Size = New-Object System.Drawing.Size(300, 400)
$Form.StartPosition = "CenterScreen"


# Create a label to display instructions
$PhNolabel = New-Object Windows.Forms.Label
$PhNolabel.Text = "Enter Pharmacy Number ex: 175 "
$PhNolabel.Location = New-Object Drawing.Point(20, 20)
$PhNolabel.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($PhNolabel)

# Create a text box for Pharmacy Number
$PhNumberInputBox = New-Object System.Windows.Forms.TextBox
$PhNumberInputBox.Location = New-Object System.Drawing.Point(50, 50)
$PhNumberInputBox.Size = New-Object System.Drawing.Size(200, 20)
$PhNumberInputBox.Focus()
$Form.Controls.Add($PhNumberInputBox)

# Create a username label to display userid
$usernamelabel = New-Object Windows.Forms.Label
$usernamelabel.Text = "Enter User Id ex: 3611"
$usernamelabel.Location = New-Object Drawing.Point(20, 80)
$usernamelabel.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($usernamelabel)

# Create a text box for user username input
$NameInputBox = New-Object System.Windows.Forms.TextBox
$NameInputBox.Location = New-Object System.Drawing.Point(50, 110)
$NameInputBox.Size = New-Object System.Drawing.Size(200, 20)
$Form.Controls.Add($NameInputBox)

# Create a label to display passowrd
$passwordlabel = New-Object Windows.Forms.Label
$passwordlabel.Text = "Enter Password:"
$passwordlabel.Location = New-Object Drawing.Point(20, 140)
$passwordlabel.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($passwordlabel)

# Create a text box for user password input
$passwordInputBox = New-Object System.Windows.Forms.TextBox
$passwordInputBox.Location = New-Object System.Drawing.Point(50, 170)
$passwordInputBox.Size = New-Object System.Drawing.Size(200, 20)
$Form.Controls.Add($passwordInputBox)

# Create a label to display from date
$fromlabel = New-Object Windows.Forms.Label
$fromlabel.Text = "From: ex: 1/1/2024"
$fromlabel.Location = New-Object Drawing.Point(20, 200)
$fromlabel.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($fromlabel)

# Create date picker for from
$fromInputBox = New-Object System.Windows.Forms.DateTimePicker
$fromInputBox.Location = New-Object System.Drawing.Point(50, 230)
$fromInputBox.Size = New-Object System.Drawing.Size(200, 20)
$Form.Controls.Add($fromInputBox)

# Create a label to display to date
$tolabel = New-Object Windows.Forms.Label
$tolabel.Text = "From: ex: 1/1/2024"
$tolabel.Location = New-Object Drawing.Point(20, 260)
$tolabel.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($tolabel)

# Create date picker for from
$toInputBox = New-Object System.Windows.Forms.DateTimePicker
$toInputBox.Location = New-Object System.Drawing.Point(50, 290)
$toInputBox.Size = New-Object System.Drawing.Size(200, 20)
$form.Controls.Add($toInputBox)


# Create an Login button
$Button = New-Object System.Windows.Forms.Button
$Button.Location = New-Object System.Drawing.Point(100, 320)
$Button.Size = New-Object System.Drawing.Size(100, 30)
$Button.Text = "Login"
$Form.Controls.Add($Button)

# Show the form as a dialog box



$Button.Add_Click({

$pharmacyNo = $PhNumberInputBox.Text
$userName = $NameInputBox.Text
$password = $passwordInputBox.Text
$from = $fromInputBox.Text
$to = $toInputBox.Text
$from = Get-Date $from -Format "MM/dd/yyy"
$to = Get-Date $to -Format "MM/dd/yyy"

$Form.Controls.Remove($PhNolabel)
$Form.Controls.Remove($usernamelabel)
$Form.Controls.Remove($passwordlabel)
$Form.Controls.Remove($fromlabel)
$Form.Controls.Remove($tolabel)
$Form.Controls.Remove($PhNumberInputBox)
$Form.Controls.Remove($NameInputBox)
$Form.Controls.Remove($passwordInputBox)
$Form.Controls.Remove($fromInputBox)
$Form.Controls.Remove($toInputBox)
$Button.Hide()
# Create a label to display instructions

$loadinglabel = New-Object Windows.Forms.Label
$filename = "Expire 2024 From $from To $to.xlsx".Replace('/', '-')
$path = "$DesktopPath/$filename"
$loadinglabel.Text = "wait until fetching data .... "
$loadinglabel.Location = New-Object Drawing.Point(75, 180)
$loadinglabel.Size = New-Object System.Drawing.Size(200, 20)
$Form.Controls.Add($loadinglabel)
try {

$login = Invoke-WebRequest -Uri "http://172.23.27.43:555/Home/SelectStore" -SessionVariable websesssion
}

catch {
[System.Windows.Forms.MessageBox]::Show("Can not connect to server now", 'Warning', [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
$Form.Close()
$Form.Dispose()
[Environment]::Exit(1)
}

$forgeryToken = ($login.InputFields |
Where-Object { $_.name -eq "__RequestVerificationToken" }).value
Write-Host $forgeryToken
$body = @{
"__RequestVerificationToken" = $forgeryToken
"SELECTED_STORE" = "P$pharmacyNo"
}

$header = @{
"Content-Type" = "application/x-www-form-urlencoded"
"SELECTED_STORE" = "P$pharmacyNo"
}



try {
Invoke-WebRequest -Method Post -Headers $header -Uri "http://172.23.27.43:555/Home/SelectStore" -Body $body -WebSession $websesssion
$login2 = Invoke-WebRequest -Uri "http://172.23.27.43:555/Account/Login" -SessionVariable websesssion
$forgeryToken2 = ($login2.InputFields |
Where-Object { $_.name -eq "__RequestVerificationToken" }).value

$body2 = @{
"UserID" = $userName
"Password" = $password
"RememberMe" = "false"
"__RequestVerificationToken" = $forgeryToken2
}

$header2 = @{
"Content-Type" = "application/x-www-form-urlencoded"
}

}
catch {


[System.Windows.Forms.MessageBox]::Show("Invalid Store", 'Warning', [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)

$Form.Close()
$Form.Dispose()
[Environment]::Exit(1)
}


$Results2 = Invoke-WebRequest -Method Post -Headers $header2 -Uri "http://172.23.27.43:555/Account/Login" -Body $body2 -WebSession $websesssion

$forgeryToken3 = ($Results2.InputFields |
Where-Object { $_.name -eq "__RequestVerificationToken" }).value
$cookie = [System.Net.Cookie]::new('SELECTED_STORE', "P$pharmacyNo")
$websesssion.Cookies.Add('http://172.23.27.43:555/GoodsReceived/GetGrTransactions', $cookie)
$body3 = @{
"fromDate" = "$from 12:00:00 AM"
"toDate" = "$to 12:00:00 AM"
"__RequestVerificationToken" = $forgeryToken3

}

$header3 = @{
"Content-Type" = "application/x-www-form-urlencoded"
"accept" = "application/json"

}


$data = Invoke-WebRequest -Method Post -Headers $header3 -Uri "http://172.23.27.43:555/GoodsReceived/GetGrTransactions" -Body $body3 -WebSession $websesssion | Select-Object -Expand Content
try {
$jsonObj = $data | ConvertFrom-Json
}
catch {
[System.Windows.Forms.MessageBox]::Show("Invalid entry data", 'Warning', [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
$Form.Close()
$Form.Dispose()
[Environment]::Exit(1)
}

$json = $jsonObj.Data


if ($json) {

$report = foreach ($obj in $json.PSObject.Properties) {
$j2 = $obj.Value.PSObject.Properties
foreach ($obj2 in $j2) {
$batch = $obj2.Value.Batch
$ItemNumber = $obj2.Value.ItemNumber
$Description = $obj2.Value.Description
foreach ($bt in $batch) {

$bt2 = $bt
if (-not ([string]::IsNullOrEmpty($bt)) ) {
if ($bt.StartsWith("B") -and $bt.EndsWith("24") ) {
$bt2 = $bt.Replace('B', '')
$bt2 = ($bt2 -split '(..)').Where({ $_ }) -join '-'
$bt2 = $bt2.Substring($bt2.Length - 5)
[PSCustomObject]@{
"ItemNumber" = $ItemNumber[$batch.IndexOf($bt)]
"Description" = $Description[$batch.IndexOf($bt)]
"Expire" = $bt2
}
}
}

}
}
}
}





$report | Select-Object ItemNumber , Description , Expire | Sort-Object Expire | ConvertTo-CSV -NoTypeInformation | Out-File -encoding UTF8 -filepath $path

$loadinglabel.Text = "Fenished"
[string]$Header = 'Fenished'
[string]$Body = 'Your Expiry File Is Ready'
[string]$RedirectURL = [System.Security.SecurityElement]::Escape('https://drnull.web.app')
[string]$HeroImage = [System.Security.SecurityElement]::Escape('https://drnull.web.app/images/favicon.ico')
[string]$AppLogo = [System.Security.SecurityElement]::Escape('https://drnull.web.app/images/favicon.ico')

$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
$null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
$null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]

$xml = @"
<toast>
<visual>
<binding template="ToastGeneric">
<image placement="appLogoOverride" hint-crop="circle" src="$AppLogo"/>
<text>$Header</text>
<text>$Body</text>
<image src="$HeroImage"/>
</binding>
</visual>
<actions>
<action content="Visit My Website (dr null)" activationType="protocol" arguments="$RedirectURL" />
</actions>
</toast>
"@

$toastXml = [Windows.Data.Xml.Dom.XmlDocument]::new()
$toastXml.LoadXml($xml)
$toast = [Windows.UI.Notifications.ToastNotification]::new($toastXml)
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)

Invoke-item $path
$Form.Close()


$myshell = New-Object -com "Wscript.Shell"
$myshell.sendkeys("{ENTER}")
$Form.Dispose()
[Environment]::Exit(1)


})

$Form.ShowDialog()

$myshell = New-Object -com "Wscript.Shell"
$myshell.sendkeys("{ENTER}")

