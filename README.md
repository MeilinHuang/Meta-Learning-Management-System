# MetaLMS

Git repository for the Meta LMS Thesis project.

## To compile:

### Windows
Download Windows Subsystem for Linux at https://docs.microsoft.com/en-us/windows/wsl/install-win10 and run:
```
sudo apt install latexmk
cd Thesis/ThesisA
```
Then run `latexmk -pdf thesisa.tex` and open thesisa.pdf

### Mac
Download MacTex at http://www.tug.org/mactex/ and run:
```
cd Thesis/ThesisA
pdflatex thesisa.tex
```
