<?php

namespace Drupal\smart_contents\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Provides a 'FooterContentBlock' block.
 *
 * @Block(
 *   id = "footer_content_block",
 *   admin_label = @Translation("Footer Content Block"),
 *   category = @Translation("Smart Contents")
 * )
 */
class FooterContentBlock extends BlockBase {


  /**
   * {@inheritdoc}
   */
  public function build() {




    $content = [
      //modal-side modal-top-right
      '#theme' => 'footer_content',
      '#vars' => ['title_id' => 'title-footer-content' ],
      '#title'=> '',
      '#content'=> 'hajaaaa',
      '#id'=> 'footer',
      '#class'=> 'bottom',
    ];

//    ksm('dwcdw');
    return $content;
  }




}
