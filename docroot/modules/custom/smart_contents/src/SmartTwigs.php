<?php

namespace Drupal\smart_contents;

/**
 * Class DefaultService.
 *
 * @package Drupal\SmartTwigs
 */
class SmartTwigs extends \Twig_Extension {

  /**
   * {@inheritdoc}
   * This function must return the name of the extension. It must be unique.
   */
  public function getName() {
    return 'smartTwig';
  }

  /**
   * In this function we can declare the extension function
   * @return array|\Twig\TwigFunction[]
   */
  public function getFunctions() {
    return [
      new \Twig_SimpleFunction('nformat',
        [$this, 'nformat'],
        ['is_safe' => array('html')]),
      new \Twig_SimpleFunction('daysToYears',
        [$this, 'daysToYears'],
        ['is_safe' => array('html')]),
      new \Twig_SimpleFunction('timeAgo',
            [$this, 'timeAgo'],
            ['is_safe' => array('html')]),
      new \Twig_SimpleFunction('format_hms_time',
            [$this, 'format_hms_time'],
            ['is_safe' => array('html')]),
      new \Twig_SimpleFunction('json_encoded',
            [$this, 'json_encoded'],
            ['is_safe' => array('html')]),
      new \Twig_SimpleFunction('format_time_utc',
            [$this, 'format_time_utc'],
            ['is_safe' => array('html')]),
      ];

  }

  /**
   * The php function to load a given block
   * @param $block_id
   *
   * @return array
   */
  public function display_block($block_id) {
    $block = \Drupal\block\Entity\Block::load($block_id);
    return \Drupal::entityManager()->getViewBuilder('block')->view($block);
  }

  /**
   * The php function to display the hour:minutes:seconds format
   * @param $t
   * @param string $f
   *
   * @return string
   */
  public function format_hms_time($t,$f=':')
  {
    return sprintf("%02d%s%02d%s%02d", floor($t/3600), $f, ($t/60)%60, $f, $t%60);
  }

  /**
   * @param $ts
   *
   * @return mixed
   */
  public function format_time_utc($ts)
  {
    $date = \Drupal::service('date.formatter')->format($ts, 'custom', 'd M Y H:i', 'UTC');
    return $date;
  }

  /**
   *  Format $value with the appropriate SI prefix symbol
   * @param $value
   * @param int $sigFigs
   *
   * @return int|string
   */
  public function nformat($value, $sigFigs = 3){
    if($value == 0 || $value == '' ) return 0;
    //SI prefix symbols
    $units = array('', 'k', 'M', 'B', 'T', 'P', 'E');
    //how many powers of 1000 in the value?
    $index = floor(log10($value)/3);
    $value = $index ? $value/pow(1000, $index) : $value;
    return sigFig($value, $sigFigs) . $units[$index];
  }

  /**
   * Calculate $value to $sigFigs significant figures
   * @param $value
   * @param int $sigFigs
   *
   * @return float|int
   */
  public function sigFig($value, $sigFigs = 3) {
    //convert to scientific notation e.g. 12345 -> 1.2345x10^4
    //where $significand is 1.2345 and $exponent is 4
    $exponent = floor(log10(abs($value))+1);
    $significand = round(($value
          / pow(10, $exponent))
        * pow(10, $sigFigs))
      / pow(10, $sigFigs);
    return $significand * pow(10, $exponent);
  }

  /**
   * @param $days
   *
   * @return false|string
   */
  public function daysToDate($days)
  {
    return date('d M Y',strtotime($days));
  }

  /**
   * @param $time
   * @param bool $short
   *
   * @return \Drupal\Component\Render\FormattableMarkup|\Drupal\Core\StringTranslation\TranslatableMarkup|null|string
   */
  public function timeAgo($time,$short = TRUE){
      return time_ago($time,$short);
  }

  /**
   * @param $days
   *
   * @return int
   */
  public function daysToYears($days)
  {
    $days = filter_var($days, FILTER_SANITIZE_NUMBER_INT);
    if(!is_numeric($days))return $days;
    $v =  intval($days / 365);
    return abs($v);
  }

  /**
   * @param $var
   *
   * @return string
   */
  public function json_encoded($var)
  {
    return json_encode($var,1);
  }


}