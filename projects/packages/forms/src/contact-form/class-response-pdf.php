<?php
/**
 * Post to URL using Jetpack Contact Forms.
 *
 * @package automattic/jetpack
 */

namespace Automattic\Jetpack\Forms\Service;

use Dompdf\Dompdf;

/**
 * Class Response_PDF
 *
 * Generates a PDF of a response.
 */
class Response_PDF {
	/**
	 * Singleton instance
	 *
	 * @var Response_PDF
	 */
	private static $instance = null;

	/**
	 * Initialize and return singleton instance.
	 *
	 * @return Response_PDF
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * TODO
	 */
	private function __construct() {
	}

	/**
	 * Get the setup for the post to URL.
	 * This is a helper function to get the setup for the post to URL.
	 * It will return false if the setup is not valid.
	 *
	 * @return string
	 */
	private function get_pdf() {
		if ( ! class_exists( 'Dompdf\Dompdf' ) ) {
			return;
		}
		$options = new Dompdf\Options();

		// Allow remote images (http/s), but they're only allowed from same-site urls
		$options->set( 'isRemoteEnabled', true );

		$dompdf = new Dompdf\Dompdf( $options );

		$html = $this->get_form_html();
		$dompdf->loadHtml( $html );

		// (Optional) Setup the paper size and orientation
		$dompdf->setPaper( 'A4', 'landscape' );
		$dompdf->setHttpContext(
			stream_context_create(
				array(
					'ssl' => array(
						'verify_peer'       => false,
						'verify_peer_name'  => false,
						'allow_self_signed' => true,
					),
				)
			)
		);

		// Render the HTML as PDF
		$dompdf->render();

		// Output the generated PDF to Browser
		return $dompdf->stream();
	}

	/**
	 * Return Form HTML
	 */
	private function get_form_html() {
		return '<em>Hello world</em>';
	}
}
