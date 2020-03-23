VIRTUALENV := virtualenv
PY_VENV_DIR := pyenv
PYTHON := $(PY_VENV_DIR)/bin/python
PIP := $(PYTHON) -m pip

$(PY_VENV_DIR):
	$(VIRTUALENV) -p python3 $(PY_VENV_DIR)

setup: $(PY_VENV_DIR) requirements.txt
  $(PIP) install -r requirements.txt
