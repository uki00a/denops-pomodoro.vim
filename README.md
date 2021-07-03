# denops-pomodoro.vim

denops-pomodoro.vim is a Vim plugin for Pomodoro technique.

## Commands

* `PomodoroStart`: starts the timer
* `PomodoroPause`: pauses the timer
* `PomodoroResume`: resumes the paused timer
* `PomodoroReset`: resets the timer

## vim-airline integration

denops-pomodoro.vim provides [vim-airline](https://github.com/vim-airline/vim-airline) integration.

```vim
function! s:airline_after_init() abort
  let g:airline_section_c .= airline#section#create_right(['pomodoro'])
endfunction

autocmd User AirlineAfterInit call <SID>airline_after_init()
```
