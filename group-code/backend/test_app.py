import pytest

def dummy_func():
    return True

def test_dummy():
    assert dummy_func() is True