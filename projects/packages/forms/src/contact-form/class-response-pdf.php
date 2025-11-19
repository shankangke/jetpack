<?php
/**
 * Post to URL using Jetpack Contact Forms.
 *
 * @package automattic/jetpack
 */

namespace Automattic\Jetpack\Forms\ContactForm;

use Dompdf\Dompdf;
use Dompdf\Options;

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
	 * See documentation https://github.com/dompdf/dompdf
	 *
	 * @param int $feedback_id the feedback id.
	 *
	 * @return string
	 */
	public function stream_pdf( $feedback_id ) {
		if ( ! class_exists( Dompdf::class ) ) {
			return;
		}

		$options = new Options();

		// Allow remote images (http/s), but they're only allowed from same-site urls
		$options->set( 'isRemoteEnabled', true );
		$options->set( 'isHtml5ParserEnabled', true );

		$dompdf = new Dompdf( $options );

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

		$html = $this->get_form_html( $feedback_id );

		$dompdf->loadHtml( $html );

		// Render the HTML as PDF
		$dompdf->render();

		$filename = 'jetpack-forms-response-' . $feedback_id . '.pdf';

		header( 'Content-type: application/pdf', true, 200 );
		header( 'Content-Disposition: attachment; filename=' . $filename );
		header( 'Cache-Control: private' );
		header( 'Expires: 0' );

		// Output the generated PDF to Browser
		return $dompdf->stream( $filename, array( 'Attachment' => false ) );
	}

	/**
	 * Return Form HTML
	 *
	 * @param int $feedback_id the feedback id.
	 */
	private function get_form_html( $feedback_id ) {

		$footer         = '';
		$tracking_pixel = '';
		$actions        = '';
		$style          = '';
		$template       = '';
		$title          = '';

		/**
		 * Filter the title used in the response pdf.
		 *
		 * @module contact-form
		 *
		 * @since $$next-version$$
		 *
		 * @param string the title of the pdf
		 */
		$title = (string) apply_filters( 'jetpack_forms_response_pdf_title', '' );
		$body  = Contact_Form::get_compiled_form_for_email( $feedback_id, null );

		/**
		 * Filter the filename of the template HTML surrounding the response email. The PHP file will return the template in a variable called $template.
		 *
		 * @module contact-form
		 *
		 * @since $$next-version$$
		 *
		 * @param string the filename of the HTML template used for response pdf
		 */
		require apply_filters( 'jetpack_forms_response_pdf_template', __DIR__ . '/templates/email-response.php' );
		$html_message = sprintf(
		// The tabs are just here so that the raw code is correctly formatted for developers
		// They're removed so that they don't affect the final message sent to users
			str_replace(
				"\t",
				'',
				$template
			),
			( $title !== '' ? '<h1>' . $title . '</h1>' : '' ),
			$body,
			'',
			'',
			$footer,
			$style,
			$tracking_pixel,
			$actions
		);

		return $html_message;
	}
}
