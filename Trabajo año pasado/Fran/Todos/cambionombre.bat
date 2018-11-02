@echo off
setlocaL ENABLEDELAYEDEXPANSION

ren *.png *.jpg

dir /b > lista.txt

set i=0
for /f "tokens=*" %%h in (lista.txt) do (
	set /a i=!i!+1
	set LIN_!i!=%%h
	
	echo %%h
	set /p n=¿Que numero quieres ponerle a la imagen?
	copy "%~dp0%%h"  "..\Ciudad\!n!.*"
)

del lista.txt
exit