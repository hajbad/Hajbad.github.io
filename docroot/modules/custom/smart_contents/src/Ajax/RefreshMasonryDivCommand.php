<?php

namespace Drupal\smart_contents\Ajax;

use Drupal\Core\Ajax\CommandInterface;
use Drupal\Core\Ajax\CommandWithAttachedAssetsInterface;
use Drupal\Core\Ajax\CommandWithAttachedAssetsTrait;

/**
 * Generic AJAX command for RefreshMasonryDivCommand content.
 *
 * This command instructs the client to insert the given HTML using whichever
 * jQuery DOM manipulation method has been specified in the #ajax['method']
 * variable of the element that triggered the request.
 *
 * This command is implemented by Drupal.AjaxCommands.prototype.insert()
 * defined in misc/ajax.js.
 *
 * @ingroup ajax
 */
class RefreshMasonryDivCommand implements CommandInterface {

//  use CommandWithAttachedAssetsTrait;


  /**
   * A CSS selector string.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $selector;


  /**
   * An optional list of arguments to pass to the method.
   *
   * @var array
   */
  protected $arguments;

  /**
   * A settings array to be passed to any attached JavaScript behavior.
   *
   * @var array
   */
  protected $settings;

  /**
   * Constructs an InvokeCommand object.
   *
   * @param string $selector
   *   A jQuery selector.
   * @param array $arguments
   *   An optional array of arguments to pass to the method.
   * @param array $settings
   *   An array of JavaScript settings to be passed to any attached behaviors.
   */
  public function __construct($selector, array $arguments = [], array $settings = []) {
    $this->selector = $selector;
    $this->arguments = $arguments;
    $this->settings = $settings + ['listClass'=>0];

  }

  /**
   * Implements Drupal\Core\Ajax\CommandInterface:render().
   */
  public function render() {

    return [
      'command' => 'refreshMasonryDiv',
      'selector' => $this->selector,
      'args' => $this->arguments,
      'settings' => $this->settings,
    ];
  }


}