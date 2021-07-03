scriptencoding utf-8

if exists('g:loaded_denops_pomodoro_airline_integration')
  finish
endif

let g:loaded_denops_pomodoro_airline_integration = 1

function! airline#extensions#pomodoro#status(...) abort
  return get(g:, 'pomodoro_timer_status', '')
endfunction

function! airline#extensions#pomodoro#init(ext) abort
  call airline#parts#define_function('pomodoro', 'airline#extensions#pomodoro#status')
endfunction

