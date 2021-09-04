import './css/index.css';
import React, {Component} from 'react';
import {MdChatBubble} from 'react-icons/md';

import Flex from 'react-flexview';
import {Link} from 'react-router-dom';
import swal from '@sweetalert/with-react';
import Clock from './Clock';
import ActionMenu from './ActionMenu';
import Popup from './Popup';

export default class Toolbar extends Component {
  handleBlur = () => {
    this.props.onRefocus();
  };

  handleMouseDown = (e) => {
    e.preventDefault();
  };

  handlePencilClick = (e) => {
    e.preventDefault();
    this.props.onTogglePencil();
  };

  handlePencilColorPickerClick = (e) => {
    e.stopPropagation();
    let hexColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--pencil-color')
      .trim()
      .substring(1);
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split('')
        .map(function (hex) {
          return hex + hex;
        })
        .join('');
    }
    this.pencilColorPicker.value = '#' + hexColor;
    this.pencilColorPicker.click();
  };

  handlePencilColorPickerChange = (e) => {
    document.documentElement.style.setProperty('--pencil-color', e.target.value);
  };

  handleAutocheckClick = (e) => {
    e.preventDefault();
    this.props.onToggleAutocheck();
  };

  handleToggleChat = (e) => {
    e.preventDefault();
    this.props.onToggleChat();
  };

  renderClockControl() {
    const {startTime, onStartClock, onPauseClock} = this.props;
    return startTime ? (
      <button
        className="toolbar--btn pause"
        tabIndex={-1}
        onMouseDown={this.handleMouseDown}
        onClick={onPauseClock}
      >
        Pause Clock
      </button>
    ) : (
      <button
        className="toolbar--btn start"
        tabIndex={-1}
        onMouseDown={this.handleMouseDown}
        onClick={onStartClock}
      >
        Start Clock
      </button>
    );
  }

  renderCheckMenu() {
    return (
      <div className="toolbar--menu check">
        <ActionMenu
          label="Check"
          onBlur={this.handleBlur}
          actions={{
            Square: this.check.bind(this, 'square'),
            Word: this.check.bind(this, 'word'),
            Puzzle: this.check.bind(this, 'puzzle'),
          }}
        />
      </div>
    );
  }

  renderRevealMenu() {
    return (
      <div className="toolbar--menu reveal">
        <ActionMenu
          label="Reveal"
          onBlur={this.handleBlur}
          actions={{
            Square: this.reveal.bind(this, 'square'),
            Word: this.reveal.bind(this, 'word'),
            Puzzle: this.reveal.bind(this, 'puzzle'),
          }}
        />
      </div>
    );
  }

  renderResetMenu() {
    return (
      <ActionMenu
        label="Reset"
        onBlur={this.handleBlur}
        actions={{
          Square: this.reset.bind(this, 'square'),
          Word: this.reset.bind(this, 'word'),
          Puzzle: this.reset.bind(this, 'puzzle'),
          'Puzzle and Timer': this.resetPuzzleAndTimer.bind(this),
        }}
      />
    );
  }

  renderModeMenu() {
    const {colorAttributionMode, onToggleColorAttributionMode, vimMode, vimInsert} = this.props;
    return (
      <ActionMenu
        label={
          (vimMode ? `Vim${vimInsert ? ' (Insert)' : ''}` : 'Normal') +
          (colorAttributionMode ? ' (Color)' : '')
        }
        onBlur={this.handleBlur}
        actions={{
          Normal: this.keybind.bind(this, 'normal'),
          Vim: this.keybind.bind(this, 'vim'),
          'Color Attribution': onToggleColorAttributionMode,
        }}
      />
    );
  }

  renderChatButton() {
    return <MdChatBubble onClick={this.handleToggleChat} className="toolbar--chat" />;
  }

  renderPencil() {
    const {pencilMode} = this.props;
    return (
      <div
        className={`toolbar--pencil${pencilMode ? ' on' : ''}`}
        onClick={this.handlePencilClick}
        onMouseDown={this.handleMouseDown}
        title="Shortcut: ."
      >
        <i className="fa fa-pencil" />
        <div className={'toolbar--pencil-color-picker-container'}>
          <div className={'toolbar--pencil-color-picker'} onClick={this.handlePencilColorPickerClick}></div>
          <input
            type="color"
            ref={(input) => (this.pencilColorPicker = input)}
            onClick={(e) => e.stopPropagation()}
            onChange={this.handlePencilColorPickerChange}
          ></input>
        </div>
      </div>
    );
  }

  renderAutocheck() {
    const {autocheckMode} = this.props;
    return (
      <div
        className={`toolbar--autocheck${autocheckMode ? ' on' : ''}`}
        onClick={this.handleAutocheckClick}
        onMouseDown={this.handleMouseDown}
        title="Autocheck"
      >
        <i className="fa fa-check-square" />
      </div>
    );
  }

  renderInfo() {
    return (
      <div className="toolbar--info">
        <Popup icon="fa-info-circle" onBlur={this.handleBlur}>
          <h3>How to Enter Answers</h3>
          <ul>
            <li>
              Click a cell once to enter an answer, and click that same cell again to switch between
              horizontal and vertical orientations
            </li>
            <li>Click the clues to move the cursor directly to the cell for that answer</li>
            <li>
              Hold down the <code>Shift</code> key to enter multiple characters for rebus answers
            </li>
          </ul>
          <h4>Keyboard Shortcuts</h4>
          <table>
            <tbody>
              <tr>
                <th>Shortcut</th>
                <th>Description</th>
              </tr>
              <tr>
                <td>Letter / Number</td>
                <td>
                  Fill in current cell and advance cursor to next unfilled cell in the same word, if any
                </td>
              </tr>
              <tr>
                <td>
                  <code>.</code> (period)
                </td>
                <td>Toggle pencil mode on/off</td>
              </tr>
              <tr>
                <td>Arrow keys</td>
                <td>
                  Either move cursor along current orientation or change orientation without moving cursor
                </td>
              </tr>
              <tr>
                <td>Space bar</td>
                <td>Flip orientation between down/across</td>
              </tr>
              <tr>
                <td>
                  <code>[</code> and
                  <code>]</code> OR
                  <code>Shift</code> with arrow keys
                </td>
                <td>Move cursor perpendicular to current orientation without changing orientation</td>
              </tr>
              <tr>
                <td>
                  <code>Tab</code> and
                  <code>Shift+Tab</code>
                </td>
                <td>Move cursor to first unfilled square of next or previous unfilled clue</td>
              </tr>
              <tr>
                <td>
                  <code>Delete</code> or
                  <code>Backspace</code>
                </td>
                <td>Clear current cell</td>
              </tr>
            </tbody>
          </table>
        </Popup>
      </div>
    );
  }

  check(scopeString) {
    this.props.onCheck(scopeString);
  }

  reveal(scopeString) {
    swal({
      title: `Are you sure you want to show the ${scopeString}?`,
      text: `All players will be able to see the ${scopeString}'s answer.`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((shouldReveal) => {
      if (shouldReveal) {
        this.props.onReveal(scopeString);
      }
    });
  }

  reset(scopeString) {
    this.props.onReset(scopeString);
  }

  keybind(mode) {
    this.props.onKeybind(mode);
  }

  resetPuzzleAndTimer() {
    this.reset('puzzle');
    this.props.onResetClock();
  }

  render() {
    const {mobile, startTime, stopTime, pausedTime, onStartClock, onPauseClock, solved} = this.props;

    if (mobile) {
      return (
        <Flex className="toolbar--mobile" vAlignContent="center">
          <Flex className="toolbar--mobile--top" grow={1} vAlignContent="center">
            <Link to="/">DFAC</Link>{' '}
            <Clock
              v2={this.props.v2}
              startTime={startTime}
              stopTime={stopTime}
              pausedTime={pausedTime}
              isPaused={this.props.isPaused || !startTime}
              onStart={onStartClock}
              onPause={onPauseClock}
            />
            {solved ? null : this.renderCheckMenu()}
            {solved ? null : this.renderRevealMenu()}
            {this.renderChatButton()}
          </Flex>
        </Flex>
      );
    }

    return (
      <div className="toolbar">
        <div className="toolbar--timer">
          <Clock
            v2={this.props.v2}
            startTime={startTime}
            stopTime={stopTime}
            pausedTime={pausedTime}
            isPaused={this.props.isPaused || !startTime}
            onStart={onStartClock}
            onPause={onPauseClock}
          />
        </div>
        {solved ? null : this.renderCheckMenu()}
        {solved ? null : this.renderRevealMenu()}
        <div className="toolbar--menu reset">{this.renderResetMenu()}</div>
        {this.renderModeMenu()}
        {this.renderPencil()}
        {this.renderAutocheck()}
        {this.renderInfo()}
      </div>
    );
  }
}
