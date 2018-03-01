@echo off
reg add HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallSources /v 1 /t REG_SZ /d "<all_urls>" /f
