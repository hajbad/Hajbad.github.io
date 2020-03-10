<?php

namespace Drupal\smart_contents\Routing;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 *
 * The \Drupal\Core\Routing\RouteSubscriberBase class contains an event
 * listener that listens to this event. We alter existing routes by
 * implementing the alterRoutes(RouteCollection $collection) method of
 * this class.
 *
 * @see https://www.drupal.org/docs/8/api/routing-system/altering-existing-routes-and-adding-new-routes-based-on-dynamic-ones
 */
class RouteSubscriber extends RouteSubscriberBase {




  /**
   * {@inheritdoc}
   */
  public function alterRoutes(RouteCollection $collection) {
    if ($route = $collection->get('user.page')) {
      $route->setOption('no_cache', TRUE);
//      $route->setRequirement('_access', 'FALSE');
    }


  }



}
