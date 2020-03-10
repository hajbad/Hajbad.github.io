<?php

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

use Drupal\user\Entity\User;
use Drupal\Core\Locale\CountryManager;
use Drupal\Core\Language\LanguageManager;
use Drupal\Core\Url;
use Drupal\Core\Link;





function id_extract($id_string){
  $ids = null;
  foreach (explode(', ',$id_string) as $selected){
    $topic_ids = [];
    preg_match('#\((.*?)\)#', $selected, $topic_ids);
    $ids = $topic_ids[1];
  }
  return $ids;
}



function cache_items($type){
    $cache = \Drupal::cache()->get($type);
    return $cache ?  (array) $cache->data : [];
}

/**
 * @param $vid
 *
 * @return bool|\Drupal\node\NodeInterface $video
 */
function video_load($vid){
  $query = \Drupal::database()->select('node','n')->fields('n',['nid']);
  $query->leftJoin('node__field_v_id', 'vid', 'n.nid = vid.entity_id');
  $query->fields('vid',['field_v_id_value']);
  $query->condition('vid.field_v_id_value',  $vid)->range(0,1);
  $video_nid = $query->execute()->fetchField();


  if(empty($video_nid)) return false;
  $video = Node::load($video_nid);
//  $nodes = \Drupal::entityTypeManager()
//    ->getStorage('node')
//    ->loadByProperties(['field_v_id' => $vid,'type' => 'video']);
//  if(empty($nodes)) return false;
//  $video = reset($nodes);
  if(empty($video)) return false;

  return $video;
}





/**
 * @param $term_name
 * @param string $vid
 *
 * @return bool|\Drupal\taxonomy\TermInterface $terms
 */
function _bv_term_load($term_name,$vid = 'tags'){
//  $query = \Drupal::entityQuery('taxonomy_term');
//  $query->condition('vid', $vid);
//  $query->condition('name', $term_name,'=')->range(0,1);
//  $tids = $query->execute();
//  if(empty($tids)) return false;
//  $terms = Term::load(reset($tids));

    $query = \Drupal::database()->select('taxonomy_term_field_data','tt')->fields('tt',['tid']);
    $query->condition('tt.name',  $term_name);
    $query->condition('tt.vid',  $vid)->range(0,1);
    $tids = $query->execute()->fetchField();
    if(empty($tids)) return false;
    $terms = Term::load($tids);
  if(empty($terms)) return false;
  return $terms;
}

/**
 * @param $term_name
 * @param string $vid
 *
 * @return bool|\Drupal\Core\Entity\EntityInterface|null|static
 */
function _bv_term_match($term_name,$vid = 'tags'){
  $query = \Drupal::entityQuery('taxonomy_term');
  $query->condition('vid', $vid);
  $query->condition('name', $term_name,'CONTAINS');
  $tids = $query->execute();
  if(empty($tids)) return false;
  $terms = Term::load(reset($tids));
  return $terms;
}

/**
 * @param array $tArr
 * @param array $newVal
 *
 * @return array
 */
function _bv_term_merge($tArr = [],$newVal = []){
  if( (empty($tArr)&& empty($newVal)) || !is_array($tArr)) return [];
  foreach($tArr as $v){
    $newVal[] = reset($v);
  }
  return array_unique(array_filter($newVal));
}

/**
 * @param $fields
 * @param string $vid
 * @param array $field_extra
 *
 * @return int
 */
function _bv_term_save($fields,$vid = 'tags',array $field_extra = []){
  $term_first_time = [
    'name' => $fields['name'],
    'vid' => $vid,
  ];
  /** @var \Drupal\taxonomy\TermInterface $term */
  $term = _bv_term_load($fields['name'],$vid);
  try{
    if($term){
      foreach($field_extra as $field_key=>$field_val){
        $term->set($field_key, $field_val);
      }
    }else{
      $term_data = array_merge($term_first_time,$field_extra);
      $term =  Term::create($term_data);
    }
    $r = $term->save();
  }catch (\Exception $ex) {
    $r = 0;
  }

  return $r;
}

/**
 * @param $str
 *
 * @return array|bool
 */
function _bv_auto_complete_ref_ids($str){
//  preg_match('#\((.*?)\)#', $str, $match);
  $strs = explode(',',$str);
  $ids = [];
  foreach($strs as $k=>$v){
    preg_match( '!\(([^\)]+)\)!', $v, $match );
    $ids[] = isset($match[1]) && is_numeric($match[1]) ? $match[1] : FALSE;
//    $match = [];
  }

   $r =  array_filter($ids);
    return !empty($r) ? $r : FALSE;
}


/**
 * @param $entity
 *
 * @return bool|string
 */
function _bv_auto_complete_default_val($entity){
  /** @var \Drupal\topic\TopicInterface $entity */
   if(is_object($entity)){
     return $entity->getTitle().' ('.$entity->id().')';
   }
   return false;
}

//function vids_save($fields,$video_exist = FALSE,$ts_save = FALSE){
//  $result = 0;
//  $node_first_time = $ts_data = [];
//  $timestamp = isset($fields['changed']) ? $fields['changed'] : time();
//  $video_exist = $video_exist ? $video_exist : video_load($fields['v_id']);
//  if(!$video_exist){
//    $node_first_time = ['type' => 'video',
//      'langcode' => 'en',
//      'created' => $timestamp,
//      'path' =>  ['alias' => '/video/' . $fields['v_id']],
//      'title' => $fields['title'],
//      'field_youtube' => [
//        'input' => 'http://www.youtube.com/watch?v='.$fields['v_id'],
//        'video_id' => $fields['v_id'],
//      ],
//      /* 'body' => [
//       'summary' => '',
//       'value' => '<p>The body of my node.</p>',
//       'format' => 'full_html',
//     ],*/];
//  }
//
//  $node_prepare = [
//    'changed' => $timestamp ,
//    'uid' => isset($fields['uid']) ?  $fields['uid'] : \Drupal::currentUser()->id() ,
//  ];
//
//
//  $allowed_fields = ['v_id'=>'value','ts_data'=>'value','one_liner'=>'value','v_messaging'=>'target_id','v_ch_id'=>'target_id','ch_title'=>'value',
//                    'maintain_duration'=>'value','v_view_count'=>'value','v_is_fresh'=>'value','v_duration'=>'value','vg'=>'value','body'=>'value',
//                    'v_ch_ref'=>'value', 'v_topic_ref'=>'value','v_themes'=>'target_id','v_category'=>'target_id','v_locations'=>'target_id',
//                    'v_tags'=>'target_id','v_country'=>'iso2','v_published'=>'value','origin_type'=>'value','v_language'=>'value',
//    'cron_source'=>'value'];
//  foreach ($fields as $field_key=>$field_values){
//    if(in_array($field_key,array_keys($allowed_fields))){
//      $holder =  'field_'.$field_key ;
//      $node_prepare[$holder] = $field_values;
//    }
//  }
//
//
//  if($ts_save){
//    ksm($fields);
//    $ts_data = [ $timestamp => ['vg'=> round($fields['vg']) , 'v_view_count'=>$fields['v_view_count']
//    ]];
//  }
//
//  try {
//    $node = $video_exist;
//    if($node){
//      foreach($node_prepare as $field_key=>$field_val){
//        if($field_key == 'field_v_locations') $field_val = _bv_term_merge($node->field_v_locations->getValue(),$field_val);
////        if($field_key == 'field_v_themes') $field_val = _bv_term_merge($node->field_v_themes->getValue(),$field_val);
////        if($field_key == 'field_v_tags') $field_val = _bv_term_merge($node->field_v_tags->getValue(),$field_val);
//        $node->set($field_key, $field_val);
//      }
//
//    }else{
//      $node_data = array_merge($node_first_time,$node_prepare);
//      $node =  Node::create($node_data);
//    }
//    if($ts_save){
//      $this->video_ts_data($node,$ts_data);
//    }
//    $result = $node->save();
//  }
//  catch (\Exception $ex) {
//    \Drupal::logger('smart_config')->notice('Could not save video:  vids_save @q Unhandled exception. Error details: @message',
//      ['@message' => $ex->getMessage(),'@q'=>$fields['v_id']]);
//    $result = 0;
//  }
//
//
//  return $result;
//}




/**
 * @param $fields
 * @param bool $ch_exist
 * @param bool $replace
 *
 * @return bool|\Drupal\Core\Entity\EntityInterface|int|null|static
 */
function  channel_save($fields,$ch_exist = FALSE,$replace = TRUE){
  $node_first_time = [];
  if(!isset($fields['ch_id'])) return 0;
  $timestamp = isset($fields['changed']) ? $fields['changed'] : time();
  $ch_exist = $ch_exist ? $ch_exist : channel_load($fields['ch_id']);
  if(!$ch_exist){
    $node_first_time = [
      'title' => $fields['title'],
      'type' => 'channel',
      'langcode' => 'en',
      'created' => $timestamp,
      'path' =>  ['alias' => '/channel/' . $fields['ch_id']],
    ];
  }



  $node_prepare = [
    'changed' => $timestamp ,
    'uid' => isset($fields['uid']) ?  $fields['uid'] : \Drupal::currentUser()->id() ,
    'sticky' => isset($fields['sticky']) ?  $fields['sticky'] : 0 ,
  ];


  $allowed_fields = [  'ch_id', 'fb_id',  'ch_themes', 'ch_image_url', 'ch_view_count', 'scount', 'ch_video_count', 'ch_published',
    'ch_language', 'ch_country','insta_ch_ref', 'bv_listed', 'is_verified','insta_ch_handle','twitter_id','linkedin_id','ch_auth_user'];
  foreach ($fields as $field_key=>$field_values){
    if(in_array($field_key,$allowed_fields)){
      $holder = 'field_'.$field_key;
      $node_prepare[$holder] = $field_values;
    }
  }


  if(isset($fields['cron_v_maintain_duration'])) $node_prepare['field_cron_v_maintain_duration'] = $fields['cron_v_maintain_duration'];

  try {
    $node = $ch_exist;
    if($node){
      foreach($node_prepare as $field_key=>$field_val){
        if($field_key == 'field_ch_themes' && !$replace) $field_val = _bv_term_merge($node->field_ch_themes->getValue(),$field_val);
        $node->set($field_key, $field_val);

      }
    }else{
      $node_data = array_merge($node_first_time,$node_prepare);
      $node =  Node::create($node_data);
    }
    if(isset($fields['extra_meta'])){
      ch_meta_data($node,$fields['extra_meta']);
    }
    $node = $node->save();
  }catch (\Exception $ex) {
    \Drupal::logger('smart_config')->notice('Could not save channel:  channel_save @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>$fields['ch_id']]);
    $node = 0;
  }

  return $node;
}

/**
 * @param $ch_node
 * @param array $ts_data_current
 */
function ch_meta_data(&$ch_node,$ts_data_current = []){
  /** @var \Drupal\node\NodeInterface $ch_node */
  $ts_data = (array) json_decode($ch_node->field_ch_meta->value,TRUE) ;
  $ts_data = array_merge($ts_data , $ts_data_current);
  $ch_node->set('field_ch_meta',json_encode($ts_data));
}

/**
 * @param $v_node
 * @param array $ts_data_current
 */
function v_meta_data(&$v_node,$ts_data_current = []){
  /** @var \Drupal\node\NodeInterface $v_node */
  $ts_data = (array) json_decode($v_node->field_v_meta->value,TRUE) ;
  $ts_data = array_merge($ts_data , $ts_data_current);
  $v_node->set('field_v_meta',json_encode($ts_data));
}

/**
 * @param $fields
 *
 * @return int
 */
function location_save($fields){
  $term_first_time = [
    'name' => $fields['name'],
    'vid' => 'locations',
  ];
  $term_prepare = [
    'field_geolocation' => $fields['geolocation'],
    'field_location_country' => $fields['location_country'],
    'field_location_language' => $fields['location_language'],
    'field_location_radius' => $fields['location_radius'],
  ];

  /** @var \Drupal\taxonomy\TermInterface $term */
  if($term = _bv_term_load($fields['name'],'locations')){
    foreach($term_prepare as $field_key=>$field_val){
      $term->set($field_key, $field_val);
    }
  }else{
    $term_data = array_merge($term_first_time,$term_prepare);
    $term =  Term::create($term_data);
  }
  try{
    $r = $term->save();
    pathauto_entity_insert($term);
  }catch (Exception $ex) {
    $r = 0;
  }
  return $r;
}

/**
 * @param $fields
 * @param bool $user
 *
 * @return int
 */
function user_save($fields,$user = FALSE){
  $user_prepare = [];
  $r = 0;
  $timestamp = isset($fields['changed']) ? $fields['changed'] : time();
  $user_exist = $user ? $user : User::load(\Drupal::currentUser()->id());

  $user_prepare = [
    'changed' => $timestamp ,
    ];


  $allowed_fields = [   'user_meta','user_topics',  'user_tracking_ch', 'user_languages', 'user_countries','user_owned_ch','user_locations','cust_products',];
  foreach ($fields as $field_key=>$field_values){
    if(in_array($field_key,$allowed_fields)){
      $holder = 'field_'.$field_key;
      $user_prepare[$holder] = $field_values;
    }
  }

  try {
    if($user_exist){
      foreach($user_prepare as $field_key=>$field_val){
        $user_exist->set($field_key, $field_val);
      }
      $r = $user_exist->save();
    }
//    }else{
//      $node =  Node::create($user_prepare);
//    }

  }catch (\Exception $ex) {
    \Drupal::logger('smart_config')->notice('Could not save User:  user_save @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>$fields['ch_id']]);
    $r = 0;
  }
  return $r;
}


/** Format $value with the appropriate SI prefix symbol */
function nformat($value, $sigFigs = 3){
  if($value == 0 || $value == '' ) return 0;
  //SI prefix symbols
  $units = array('', 'k', 'M', 'B', 'T', 'P', 'E');
  //how many powers of 1000 in the value?
  $index = floor(log10($value)/3);
  $value = $index ? $value/pow(1000, $index) : $value;
  return sigFig($value, $sigFigs) . $units[$index];
}

/** Calculate $value to $sigFigs significant figures */
function sigFig($value, $sigFigs = 3) {
  //convert to scientific notation e.g. 12345 -> 1.2345x10^4
  //where $significand is 1.2345 and $exponent is 4
  $exponent = floor(log10(abs($value))+1);
  $significand = round(($value
        / pow(10, $exponent))
      * pow(10, $sigFigs))
    / pow(10, $sigFigs);
  return $significand * pow(10, $exponent);
}


function softTrim($text, $count = 240, $wrapText='...'){

  if(strlen($text)>$count){
    preg_match('/^.{0,' . $count . '}(?:.*?)b/siu', $text, $matches);
    $text = $matches[0] ?? '-';
  }else{
    $wrapText = '';
  }
  return $text . $wrapText;
}


/**
 * @param $ch_id
 * @param $field
 *
 * @return string
 */
function assign_channel_info_to_video($ch_id,$field){
  return '0';
  /*$exist_ch_info = db_query("SELECT $field FROM iit_youtube_channels WHERE  ch_id = :ch_id LIMIT 1", array(':ch_id' => $ch_id))->fetchField();
  if (!empty($exist_ch_info) && $exist_ch_info != '0' && $exist_ch_info != '' && !is_null($exist_ch_info)) return $exist_ch_info;
  return '0';*/
}

function assign_channel_theme_to_video_node($ch_node){
  //$ch_node = channel_load($ch_id);
  $terms = isset($ch_node->field_ch_themes) ? _bv_term_merge($ch_node->field_ch_themes->getValue()) : [];
  return $terms;
}

function assign_tags_to_video_node($vsnips,$str = ''){
  $str = preg_replace("/[^A-Za-z0-9?!\s]/","",$str);
  $str = explode(' ', $str);
  $vtags = !isset($vsnips['tags']) ? [] : $vsnips['tags'];
  $vtags = array_merge($vtags,$str);
  $items = [];
  foreach($vtags as $tag){
    // if(strlen($tag) <= 32){
    if($term = _bv_term_load($tag)){
      $items[] = $term->id();
    }
    //}
  }
  return array_unique($items);
}


function _get_tid_from_term_name($term_name,$vid = 'tags',$write = false) {
  /*$arr_terms = taxonomy_get_term_by_name($term_name, $vocabulary);
  if (!empty($arr_terms)) {
    $arr_terms = array_values($arr_terms);
    $tid = $arr_terms[0]->tid;
  }
  else {
    if(preg_match("/^[\w\d\s.,-]*$/", $term_name)){
      $vobj = taxonomy_vocabulary_machine_name_load($vocabulary);
      $term = new stdClass();
      $term->name = $term_name;
      $term->vid = $vobj->vid;
      taxonomy_term_save($term);
      $tid = $term->tid;
    }else{
      $tid = false;
    }
  }*/



  /** @var \Drupal\taxonomy\TermInterface $term */
  if ($term = _bv_term_load($term_name, $vid)) {
    $term = $term;
  }else {
    if($write && preg_match("/^[\w\d\s.,-]*$/", $term_name)){
      $term_first_time = [ 'name' => $term_name, 'vid' => $vid, ];
      $term =  Term::create($term_first_time);
      $term->save();
    }else{  return null;  }
  }
  return $term->id();
}


/*
function bv_video_write(){
  $timestamp = time();
  $virals = youtube_viral_search('', array('maxResults'=>16, 'relatedToVideoId'=>'GKSRyLdjsPA', 'timeAgo' => '-1 week'));
  if(!empty($viral['items'])){
    $current_snaps[] = youtube_viral_node_snap($viral, $timestamp);
  }
}
*/





function getClosestMax($search, $arr,$returnIndex = FALSE) {
  if(empty($arr))return false;
  $closest = min($arr);
  $index = 0;
  foreach ($arr as $k=>$item) {
    if($search >= $item){
      $closest = $item;
      $index = $k;
      break;
    }
  }

  if($returnIndex)return [$index=>$closest];
  return $closest;
}

function getClosestWithin($search, $arr,$returnIndex = FALSE) {
  $closest = null;
  $index = 0;
  foreach ($arr as $k=>$item) {
    if($search <= $item){
      $closest = $item;
      $index = $k;
      break;
    }
  }

  if($returnIndex)return [$index=>$closest];
  return $closest;
}

function getClosest($search, $arr,$returnIndex = FALSE) {
  $closest = null;
  $index = 0;
  foreach ($arr as $k=>$item) {
    if ($closest === null || abs($search - $closest) > abs($item - $search)) {
      $closest = $item;
      $index = $k;
    }
  }

  if($returnIndex)return [$index=>$closest];
  return $closest;
}

function getPromoRating($current_vg,$std_vg, $multiplier) {
  $closest  = null;

  $index = 0;
  $promotePercentage = 100;
//  if(\Drupal::currentUser()->hasPermission('administer nodes'))dsm($multiplier,'$multiplier');
  foreach ($multiplier as $k=>$comment) {
//    if(\Drupal::currentUser()->hasPermission('administer nodes'))dsm($k,'$multiplier single');
    $value = $k*$std_vg;   // 0.3*120

//    if(\Drupal::currentUser()->hasPermission('administer nodes'))dsm($value,'ratingStd='.$k.'x'.$std_vg);

    if ($current_vg <= $value) {  // 230.46   => 36   then 72, 120 , 240
      $closest = $value;
      $index = $k;
      $rating = $comment;
      break;
    }
    $promotePercentage -= 20;
  }

  if($promotePercentage == 0){
    $closest = $value;
    $index = $k;
    $rating = $comment;
  }

  return ['ratingIndex'=>$index,'ratingValue'=>$closest,'ratingMessage'=>$rating,'promotePercentage'=>$promotePercentage];
}

function _bv_time_options(){
  return ['-2 hours' => '2 Hours','-4 hours' => '4 Hours','-6 hours' => '6 Hours','-12 hours' => '12 Hours', '-1 day' => '1 day', '-2 days' => '2 days', '-3 days' => '3 days', '-4 days' => '4 days', '-6 days' => '6 days', '-7 days' => '7 days','-10 days' => '10 days','-14 days' => '14 days','-20 days' => '20 days','-30 days' => '30 days','-60 days' => '60 days','-93 days' => '93 days','-186 days' => '186 days','-365 days' => '365 days','-1000 days' => '1000 days','-2000 days' => '2000 days','-3650 days' => '3650 days','-7000 days' => '7000 days',];
}

function _bv_yt_order_by_options(){
  return ['date' => 'date','rating' => 'rating','relevance' => 'relevance','title' => 'title', 'videoCount' => 'videoCount', 'viewCount' => 'viewCount', ];
}


function _bv_video_allowed_filters(){
  $allowed_filters = ['language'=>0,'country'=>0,'city'=>0,'theme'=>0,'tag'=>0,'chId'=>0,'source'=>0,
                      'fresh'=>0,'vgMin'=>0,'vgMax'=>0,'vcMin'=>0,'vcMax'=>0,'year'=>0,'daysAgo'=>0,
                    'daysBefore'=>0,'publishedBefore'=>0,'publishedAfter'=>0,'published'=>0,'chExist'=>0,
                    'vc'=>0,'vg'=>0,'topic'=>0,];
  return $allowed_filters;
}



function _bv_json_decode ($json, $assoc = false, $depth = null) {
  if ($assoc && !$depth)
    return json_decode($json, $assoc);
  else if ($depth)
    return json_decode($json, $assoc, $depth);
  return json_decode($json);
}

function _bv_field_option_allowed_values($field,$entity = 'node',$type = 'video'){
  $entityManager = \Drupal::service('entity_field.manager');
  $fields = $entityManager->getFieldStorageDefinitions($entity, $type);
  return ['_none'=>'None'] + options_allowed_values($fields[$field]);
}


function _bv_terms_list($vid = 'themes',$lists = []){
  $themes_load = \Drupal::entityManager()->getStorage('taxonomy_term')->loadTree($vid);
  foreach($themes_load as $list){
    $lists[$list->tid] = $list->name;
  }
  return $lists;
}

function _bv_country_list($code = NULL,$inverse = FALSE){
  $std_countries = CountryManager::getStandardList();
  if(!is_null($code)){
    return !$inverse && isset($std_countries[$code]) ? $std_countries[$code] : array_search($code, $std_countries);
  }
  if(is_null($code) && $inverse == 2 ) {
    $countries_autocomplete = [];
    foreach($std_countries as $country_code=>$country){
      $countries_autocomplete[$country_code] = $country.' ('.$country_code.')';
    }
    return $countries_autocomplete;
  }
    return $std_countries;
}

function _bv_language_list($code = NULL,$inverse = FALSE){

  $std_languages = LanguageManager::getStandardLanguageList();
  $languages = [];

  foreach($std_languages as $lang_code=>$language){
    if(!is_null($code)){
      if(($lang_code == $code && !$inverse)) return reset($language);
      $code =  trim($code, '"');
      if($inverse && in_array($code,$language)) {
        return $lang_code;
      }
    }else{
      if(!$inverse ) $languages[$lang_code] = reset($language);
      if($inverse == 2 ) $languages[$lang_code] = reset($language).' ('.$lang_code.')';
    }
  }
  return $languages;
}

function _bv_themes_list(){
  $themes_load = \Drupal::entityManager()->getStorage('taxonomy_term')->loadTree('themes');
  $themes['_none'] = 'Select theme';
  foreach($themes_load as $theme){
    $themes[$theme->tid] = $theme->name;
  }
  return $themes;
}

function addParamToUrl($url, array $addParams)
{
  if(!is_array($addParams))
    return $url;

  $info = parse_url($url);

  $query = array();

  if($info['query'])
  {
    parse_str($info['query'], $query);
  }

  if(!is_array($query))
    $query = array();

  $params = array_merge($query, $addParams);

  $result = '';

  if($info['scheme'])
    $result .= $info['scheme'] . ':';

  if($info['host'])
    $result .= '//' . $info['host'];

  if($info['path'])
    $result .= $info['path'];

  if($params)
    $result .= '?' . http_build_query($params);

  return $result;
}





function time_ago($time, $short = FALSE,$html = FALSE)
{
  if (empty($time)) return 'n/a';
  $time = time() - $time;
  if ($short) {
    $tokens = array(
      31536000 => 'y',
      2592000 => 'm',
      604800 => 'w',
      86400 => 'd',
      3600 => 'h',
      60 => 'mins',
      1 => 'sec'
    );
  } else {
    $tokens = array(
      31536000 => 'year',
      2592000 => 'month',
      604800 => 'week',
      86400 => 'day',
      3600 => 'hour',
      60 => 'minute',
      1 => 'second'
    );
  }

  foreach ($tokens as $unit => $text) {
    if ($time < $unit) continue;
    $numberOfUnits = floor($time / $unit);
    $t = $numberOfUnits . ' ' . $text . (($numberOfUnits > 1) ? 's' : '');
    $icon = $html ? t('<i class="fa fa-times-circle" aria-hidden="true"></i>') : '';
    return $short ? t($numberOfUnits .' '. $text . ' '.$icon) : t($t . ' ago');
  }
  return NULL;
}

function bv_date_format($ts,$format_type = 'standard'){
  switch ($format_type){
    case 'standard':
      $format = 'd M Y H:i:s';
      break;
    case 'chart':
      $format = 'd M H:i';
      break;
  }
    return \Drupal::service('date.formatter')->format(
    $ts, 'custom', $format ,drupal_get_user_timezone()
  );

  //  return Drupal\Core\Datetime\DateFormatter::format($ts, 'custom', 'd M Y H:i:s P',drupal_get_user_timezone());
}

function array_key_value_label($arr,$label_type,$render_type = 'list',$no_key = FALSE){
  $list = array();
  $url_arg = $label_type ;
  foreach ($arr as $key=>$val){
    $key_value = !is_array($val) ?  $val  : ceil(min($val)) ;
    switch($label_type){
      case 'language':
        $code = !$no_key ? $key : $val;
        $label = _bv_language_list($code);
        $label_text = $label ;
        break;
      case 'country':
        $code = !$no_key ? $key : $val;
        $label = _bv_country_list($code);
        $label_text = $label ;
        break;
      case 'channel':
//        $label = channel_name($key);
        $label = ($key);
        $label_text = !$no_key ? text_summary($label,NULL,14).' : '.$key_value : $key_value ;
        break;
      case 'taxonomy':
        $url_arg = 'taxonomy/term';
        $term = Term::load($val);
        $title = $term->toLink()->getText();
        $label_text = $title ;
        break;
      default:
        $label = $key;
        $label_text = !$no_key ? text_summary($label,NULL,14).' : '.$key_value : $key_value ;
        break;
    }

    $key = !$no_key ? $key : strtolower($key_value);
    switch($render_type){
      case 'list':
        $list[] = '<span class="label label-info ">'.\Drupal::l( $label_text ,Url::fromUri('internal:/'.$url_arg.'/'.$key)).'</span>';
        break;
      case 'table':
        $list[] =  array(\Drupal::l( $label_text ,Url::fromUri('internal:/'.$label_type.'/'.$key)) , '<span class="badge">'.$key_value.'</span>');
        break;
      case 'array':
        $list[] =  $label_text;
        break;
    }
  }

  if($render_type == 'array') return  implode(',',$list);
  return  implode(' ',$list);
}

function replaceSpace($text) {
  $text = strtolower(htmlentities($text));
  $text = str_replace(get_html_translation_table(), "-", $text);
  $text = str_replace(" ", "-", $text);
  $text = str_replace("/", "", $text);
  $text = preg_replace("/[-]+/i", "-", $text);
  return $text;
}

function get_string_between($string, $start, $end){
  $string = ' ' . $string;
  $ini = strpos($string, $start);
  if ($ini == 0) return '';
  $ini += strlen($start);
  $len = strpos($string, $end, $ini) - $ini;
  return substr($string, $ini, $len);
}

/**
 * @param array $arr
 *
 * @return float|int|null
 */
function array_median(array $arr)
{
  if (0 === count($arr)) {
    return null;
  }

  // sort the data
  $count = count($arr);
  asort($arr);

  // get the mid-point keys (1 or 2 of them)
  $mid  = floor(($count - 1) / 2);
  $keys = array_slice(array_keys($arr), $mid, (1 === $count % 2 ? 1 : 2));
  $sum  = 0;
  foreach ($keys as $key) {
    $sum += $arr[$key];
  }
  return $sum / count($keys);
}

function ytDurationToSec($string){


  $t = 0;
  if (strpos($string, 'H') !== false) {
    $h = get_string_between($string,'PT','H');
    $t += ($h*60*60);
  }

  if (strpos($string, 'H') !== false && strpos($string, 'M') !== false) {
    $m = get_string_between($string, 'H', 'M');
    $t += ($m*60);
  }
  if (strpos($string, 'H') === false && strpos($string, 'M') !== false) {
    $m = get_string_between($string, 'PT', 'M');
    $t += ($m*60);
  }

  if (strpos($string, 'M') !== false && strpos($string, 'S') !== false) {
    $s = get_string_between($string, 'M', 'S');
    $t += $s;
  }

  if (strpos($string, 'H') === false && strpos($string, 'M') === false && strpos($string, 'S') !== false) {
    $s = get_string_between($string, 'PT', 'S');
    $t += $s;
  }

  return $t;
}


/**
 * PAram : $array,'key', SORT_ASC | SORT_ASC
 * @return mixed
 */
function array_orderby(){
  $args = func_get_args();
  $data = array_shift($args);
  if(empty($data))return $data;
  foreach ($args as $n => $field) {
    if (is_string($field)) {
      $tmp = array();
      foreach ($data as $key => $row){
        $row = (array) $row;
        if(!isset($row[$field]))return $data;
        $tmp[$key] = $row[$field];
        $args[$n] = $tmp;
      }

    }
  }
  $args[] = &$data;

  call_user_func_array('array_multisort', $args);
  return array_pop($args);
}


function yt_scountRange($n){
    if($n == 0) return 0;
    if($n >= 40000000){$x=7;}
    elseif($n >= 10000000){ $x = 5;}
    elseif($n >= 8000000){ $x = 4;}
    elseif($n >= 5000000){$x=3;}
    elseif($n >= 3000000){$x=2;}
    elseif($n >= 2000000){$x=2;}
    elseif($n >= 1000000){$x=1.5;}
    elseif($n >= 500000){$x=1;}
    elseif($n >= 50000){$x=0.5;}
    else{$x=1;}
    return $x;
}

function sec2hms ($sec, $padHours = false)
{

    // do the hours first: there are 3600 seconds in an hour, so if we divide
    // the total number of seconds by 3600 and throw away the remainder, we're
    // left with the number of hours in those seconds
    $hours = intval(intval($sec) / 3600);

    // start our return string with the hours (with a leading 0 if asked for)
    if ($padHours) {
        $hms = str_pad($hours, 2, "0", STR_PAD_LEFT). ":";
    } else {
        $hms = $hours. ":";
    }

    // dividing the total seconds by 60 will give us the number of minutes
    // in total, but we're interested in *minutes past the hour* and to get
    // this, we have to divide by 60 again and then use the remainder
    $minutes = intval(($sec / 60) % 60);

    // add minutes to $hms (with a leading 0 if needed)
    $hms .= str_pad($minutes, 2, "0", STR_PAD_LEFT). ":";

    // seconds past the minute are found by dividing the total number of seconds
    // by 60 and using the remainder
    $seconds = intval($sec % 60);

    // add seconds to $hms (with a leading 0 if needed)
    $hms .= str_pad($seconds, 2, "0", STR_PAD_LEFT);

    // done!
    return $hms;

}




/**
 * @param $endpoint
 * @param array $options
 * @param boolean $post
 *
 * @return bool|mixed
 */
function insta_search($endpoint,$options = [],$post = FALSE){
  $qry = ['keyword_search'=>['q'=>'',],
          'channel'=>['channel_code'=>'','live'=>'0',],
          'channel/post_items'=>['channel_code'=>'','rank_method'=>'like_count',],
          'channel/suggested_posts'=>['channel_code'=>'','rank_method'=>'like_count',],
          'channel/img_suggested_posts'=>['channel_code'=>'','img_type'=>'','n_posts'=>'50'],
          'channel/narratives'=>['channel_code'=>''],
          'list_all_channels'=>['tracking'=>''],
          'post'=>['shortcode'=>'','live'=>'0',],
          'post/narratives'=>['shortcode'=>'','live'=>'0',],
          'stats/post/advanced_metrics'=>['shortcode'=>'',],
          'channels_overview'=>['rank_method'=>'','page'=>'1',],
          'stats/likability/instant_stat'=>['shortcode'=>'','n_posts'=>'20','hr'=>'3','stat'=>'like_count'],
          'stats/lifetime/expiration_info'=>['shortcode'=>'',],
          'stats/lifetime/estimated_lifetime'=>['shortcode'=>'',],
          'stats/lifetime/growth_rate'=>['shortcode'=>'','hr'=>'4'],
          'stats/like_contribution/hr_of_day_contribution'=>['shortcode'=>''],
          'stats/like_contribution/lifetime_contribution'=>['shortcode'=>''],
          'stats/lifetime/expiration_bounds'=>['channel_id'=>'',],
          'stats/io/post_hrs_distribution'=>['channel_id'=>'','n_posts'=>'20'],
          'visualization/contribution/hr_of_day'=>['channel_id'=>'','n_posts'=>'20'],
          'visualization/contribution/lifetime'=>['channel_id'=>'','n_posts'=>'20'],
          'visualization/expiration/scatter'=>['channel_id'=>''],
          'visualization/contribution/single_hr_of_day'=>['shortcode'=>''],
          'visualization/contribution/single_lifetime'=>['shortcode'=>''],
          'visualization/instant_stats'=>['shortcode'=>''],
          'nlp/sentiment'=>['data'=>'','agg'=>'0'],
          'nlp/string_sentiment'=>['param'=>''],
  ];
  if(!in_array($endpoint,array_keys($qry)))return false;
  $query_merged = array_merge($qry[$endpoint],$options);
  $base_url = 'https://crbzrhh6gf.execute-api.us-west-1.amazonaws.com/dev/'.$endpoint;
//  $query_merged =  json_encode($query_merged,1,2056);


  $client = \Drupal::httpClient();

  try {

    $x_api_key = 'olvKiYUoqO6UlsrlNiHhEaezqXabLesY4VmarfJR';
    if(!$post){
      $reqParam = ['headers' => ['x-api-key' => $x_api_key]];
      $queried = http_build_query($query_merged);
      $qline = ($base_url.'?'.$queried);
      $request = $client->get($qline, $reqParam);
    }else{

      $reqParam = [
        'verify' => TRUE,
        'form_params' => $query_merged,
        'headers' => [
          'x-api-key' => $x_api_key,
          'Content-type' => 'application/x-www-form-urlencoded',
        ]];
      $request = $client->post($base_url, $reqParam);
//      $d = (string) $request->getBody()->getContents();
    }

    $d = (string) $request->getBody();
  }
  catch (\Exception $ex) {
    \Drupal::logger('insta_search')->notice('Could not load the insta_search search request : ( @req ) :  @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>'yes','@req'=>$base_url]);
//    dsm($ex->getMessage());
    return false;
  }

  $feed_array = json_decode($d, true);

  return $feed_array;
}





/**
 * @param $endpoint
 * @param array $options
 * @param boolean $post
 *
 * @return bool|mixed
 */
function tiktok_search($endpoint,$options = [],$post = FALSE){
  $qry = ['channel/info'=>['unique_id'=>'',],
          'channel/display'=>['unique_id'=>'',],
          'channel/metrics'=>['unique_id'=>'',],
          'overview/list_all_channels'=>['tracking'=>'1',],
          'channel/suggested_posts'=>['unique_id'=>'','rank_method'=>'','order'=>'','n_posts'=>'','page'=>''],
          'post/info'=>['post_id'=>'',],
          'post/metrics'=>['post_id'=>'',],
          'post/display'=>['post_id'=>'',],

  ];
  if(!in_array($endpoint,array_keys($qry)))return false;
  $query_merged = array_merge($qry[$endpoint],$options);
  $base_url = 'https://11scqj20y7.execute-api.us-west-1.amazonaws.com/dev/'.$endpoint;
//  $query_merged =  json_encode($query_merged,1,2056);


  $client = \Drupal::httpClient();
  try {

    $x_api_key = 'olvKiYUoqO6UlsrlNiHhEaezqXabLesY4VmarfJR';
    if(!$post){
      $reqParam = ['headers' => ['x-api-key' => $x_api_key]];
      $queried = http_build_query($query_merged);
      $qline = ($base_url.'?'.$queried);
      $request = $client->get($qline, $reqParam);
    }else{

      $reqParam = [
        'verify' => TRUE,
        'form_params' => $query_merged,
        'headers' => [
          'x-api-key' => $x_api_key,
          'Content-type' => 'application/x-www-form-urlencoded',
        ]];
      $request = $client->post($base_url, $reqParam);
//      $d = (string) $request->getBody()->getContents();
    }

    $d = (string) $request->getBody();
  }
  catch (\Exception $ex) {
    \Drupal::logger('tiktok_search')->notice('Could not load the tiktok_search search request : ( @req ) :  @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>'yes','@req'=>$base_url]);
//    dsm($ex->getMessage());
    return false;
  }

  $feed_array = json_decode($d, true);

  return $feed_array;
}



/**
 * @param $endpoint
 * @param array $options
 * @param boolean $post
 *
 * @return bool|mixed
 */
function google_trend_search($endpoint,$options = [],$post = FALSE){
  $qry = ['google_news'=>['output'=>'chrome','hl'=>'en','ds'=>'n','q'=>'','gl'=>'us'],
          'google_search'=>['output'=>'chrome','hl'=>'en','q'=>'','gl'=>'us'],
          'youtube_search'=>['client'=>'youtube','hl'=>'en','q'=>'','gl'=>'us'],
  ];
  if(!in_array($endpoint,array_keys($qry)))return false;
  $query_merged = array_merge($qry[$endpoint],$options);


  $base_urls = ['google_news'=>'http://suggestqueries.google.com/complete/search',
                'google_search'=>'http://suggestqueries.google.com/complete/search',
                'youtube_search'=>'http://clients1.google.com/complete/search',
  ];

  $base_url = $base_urls[$endpoint];
  $client = \Drupal::httpClient();

  try {

//    $x_api_key = 'olvKiYUoqO6UlsrlNiHhEaezqXabLesY4VmarfJR';
//    if(!$post){
////      $reqParam = ['headers' => ['x-api-key' => $x_api_key]];
      $queried = http_build_query($query_merged);
      $qline = ($base_url.'?'.$queried);
//      kint($qline,'input');
      $request = $client->get($qline);
//    }else{
//
//      $reqParam = [
//        'verify' => TRUE,
//        'form_params' => $query_merged,
//        'headers' => [
//          'x-api-key' => $x_api_key,
//          'Content-type' => 'application/x-www-form-urlencoded',
//        ]];
//      $request = $client->post($base_url, $reqParam);
////      $d = (string) $request->getBody()->getContents();
//    }



    $d = (string) $request->getBody();
  }
  catch (\Exception $ex) {
    \Drupal::logger('google_trend_search')->notice('Could not load the google_trend_search search request : ( @req ) :  @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>'yes','@req'=>$base_url]);
//    dsm($ex->getMessage());
    return false;
  }

  $feed_array = json_decode($d, true);

  return $feed_array;
}

/**
 * @param $endpoint
 * @param array $options
 * @param boolean $post
 *
 * @return bool|mixed
 */
function emerging_topic_search($endpoint,$options = [],$post = FALSE){
  $qry = ['topics/topics_by_keyword'=>['keyword'=>'',],
          'topics/network'=>['topic_id'=>'',],
          'topics/viz'=>['keyword'=>'', 'topic_id'=>'',],
          'topics/viz/v2'=>['keyword'=>'', 'topic_id'=>'','raw_news'=>'','raw_google'=>'','raw_yt'=>''],
          'gtrends/story/all_loc_cat'=>[],
          'gtrends/topics/matching_topics'=>['q'=>'','target'=>''],
          'gtrends/story/kw_type_stories'=>['q'=>'','topic_type'=>'','match'=>'c','count'=>'','page'=>''],
          'gtrends/story/topic_stories'=>['mid'=>'' ],
          'gtrends/story/titles'=>['count'=>'', 'category'=>'', 'location'=>'', 'timeframe'=>'',],
          'gtrends/story/basic_metrics'=>['story_id'=>'',],
          'gtrends/topics/matching_topic_title_type'=>['group_by'=>''], // topic_title or topic_type



  ];


//  kint($options);
  if(!in_array($endpoint,array_keys($qry)))return false;
  $query_merged = array_filter(array_merge($qry[$endpoint],$options));
  $base_url = 'https://j0s5zhzvxl.execute-api.us-west-1.amazonaws.com/dev/'.$endpoint;
  $client = \Drupal::httpClient();
      $x_api_key = 'olvKiYUoqO6UlsrlNiHhEaezqXabLesY4VmarfJR';
  $reqParam = [
    'verify' => TRUE,
    'form_params' => $options,
    'headers' => [
      'x-api-key' => $x_api_key,
      'Content-type' => 'application/x-www-form-urlencoded',
    ]];
    try {

    if(!$post){
      $reqParam = ['headers' => ['x-api-key' => $x_api_key]];
      $queried = http_build_query($query_merged);
      $qline = ($base_url.'?'.$queried);
      $request = $client->get($qline, $reqParam);
    }else{



      $request = $client->post($base_url, $reqParam);

//      $d = (string) $request->getBody()->getContents();
    }
//
    $d = (string) $request->getBody();
  }catch (\Exception $ex) {
    \Drupal::logger('emerging_topic_search')->notice('Could not load the emerging_topic_search search request : ( @req ) :  @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>'yes','@req'=>$base_url]);
    return false;
  }


  $feed_array = json_decode($d, true);

  return $feed_array;
}

function emerging_google_suggestions($string,$options=[]){

  $query_merged = array_merge(['client'=>'safari','q'=>$string],$options);
  $base_url = 'https://suggestqueries.google.com/complete/search';
  $client = \Drupal::httpClient();
  try {

      $queried = http_build_query($query_merged);
      $qline = ($base_url.'?'.$queried);
      $request = $client->get($qline);


    $d = (string) $request->getBody();
  }
  catch (\Exception $ex) {
    \Drupal::logger('emerging_google_suggestions')->notice('Could not load the emerging_google_suggestions search request : ( @req ) :  @q Unhandled exception. Error details: @message',
      ['@message' => $ex->getMessage(),'@q'=>'yes','@req'=>$base_url]);
    return false;
  }

  $feed_array = json_decode($d, true);

  return $feed_array;

}




/**
 * @param $keyword
 *
 * @return array
 */
function emerging_topics($keyword){
  $etopics = emerging_topic_search('topics/topics_by_keyword',['keyword'=>$keyword]);
  $etopic = [];

  if(empty($etopics['record'])){
    $etopics = emerging_google_suggestions($keyword);
    $etopics = $etopics[1] ?? [];
    foreach ($etopics as $item){
      $topic_name = $item[0];
      $link = t('<a href="/smart/search/ytvideo/'.$topic_name.'">'.$topic_name.'</a>');
      $etopic[] = [$link];
    }
    $header = ['Emerging Topics ('.count($etopic).')'];
  }else{

    foreach ($etopics['record'] as $item){
      $topic_name = str_replace('#','',$item['topic_name']);
      $link = t('<a href="/smart/search/ytvideo/'.$topic_name.'">'.$item['topic_name'].'</a> <a class="mx-1 badge-pill badge rounded-circle" data-toggle="modal" data-target="#modal-content-featured" data-related-id="modal-content-featured" data-request-url="/ajax/chart_topic_emerging_network/markup/'.$item['topic_id'].'/'.$topic_name.'?selector=modal-body-content-featured&enableChart=1"><i class="fas fa-project-diagram"></i></a>');
      $etopic[] = [$link,time_ago(strtotime($item['time']))];
    }
    $header = ['Emerging Topics ('.count($etopic).')','Time'];
  }

  $output[] = [
    '#attributes' => ['id'=>'emerging-topics-report'],
    '#theme' => 'table',
    '#header' => $header,
    '#rows' =>  $etopic,
    '#empty' =>  'No Result found',
  ];
  return $output;
}


/**
 * @param $uri
 * @param $option
 *
 * @return static
 */
function _bv_link($uri,$option){
//  $option = ['query' => 'ffefef',
//    'attributes' => ['class' => ['use-ajax','bolder','btn-xs','btn'],],];
  $url = Url::fromUri('internal:'.$uri, $option);
  $link = Link::fromTextAndUrl('Load More',$url);
  return $link;
}


/**
 * @param $ts_data_record
 * @param $ts_data
 *
 * @return array
 */
function _temp_topic_ts_bug_fix($ts_data){



  $split_ts = $ts_data;
  $ts_data_split = [];
  if(isset($split_ts['Y'])){
    $ts_data_split['Y'] = $split_ts['Y'];
    unset($split_ts['Y']);
  }
  if(isset($split_ts['Y-m'])){
    $ts_data_split['Y-m'] = $split_ts['Y-m'];
    unset($split_ts['Y-m']);
  }
  if(isset($split_ts['Y-m-d'])){
    $ts_data_split['Y-m-d'] = $split_ts['Y-m-d'];
    unset($split_ts['Y-m-d']);
  }





  /*** Temp function to remove the bugs **/
  if(!isset($split_ts['manual'])){
    $ts_data_split['manual'] =  $split_ts;
  }
  if(isset($split_ts['manual']) && !isset($split_ts['manual']['manual'])){
    $ts_data_split['manual'] = $split_ts['manual'];
    unset($split_ts['manual']);
  }
  if(isset($split_ts['manual']['manual']['manual']['manual']['manual'])){
    $ts_data_split['manual'] =  $split_ts['manual']['manual']['manual']['manual']['manual'];
  }

  if(isset($split_ts['manual']['manual']['manual']['manual'])){
    $ts_data_split['manual'] =  $split_ts['manual']['manual']['manual']['manual'];
  }
  if(isset($split_ts['manual']['manual']['manual'])){
    $ts_data_split['manual'] =  $split_ts['manual']['manual']['manual'];
  }
  if(isset($split_ts['manual']['manual'])){
    $ts_data_split['manual'] =  $split_ts['manual']['manual'];
  }
  /*** Temp function to remove the bugs **/

  return $ts_data_split;
}