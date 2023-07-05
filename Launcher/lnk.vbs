Set Shell = CreateObject ("Wscript.Shell")   
Set objFSO = WScript.CreateObject("Scripting.FileSystemObject")
Dim cmdLine, path, currPath

currPath  = objFSO.GetParentFolderName(WScript.ScriptFullName)
path = objFSO.BuildPath(currPath, "..")
path =  objFSO.GetAbsolutePathName(path)

Set Shortcut = Shell.CreateShortcut(path & "\Launcher.lnk")
Shortcut.TargetPath = currPath & "\Launcher.exe"
Shortcut.Save