To run these tests, have pytest and Selenium installed.

Be sure to activate the venv with:

```zsh
source venv/bin/activate
```

(or the arr alias => Searchjunct)


Execute all tests with:

```zsh
p -m pytest selenium_scripts/ --html=report.html -n 4
```

Execute individual tests with:

```zsh
p -m pytest selenium_scripts/checks.py --html=report.html -n 4
```

```zsh
p -m pytest selenium_scripts/fuzz.py --html=report.html -n 4
```