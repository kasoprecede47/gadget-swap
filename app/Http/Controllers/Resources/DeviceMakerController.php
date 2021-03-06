<?php namespace SupergeeksGadgetSwap\Http\Controllers\Resources;

use Input;
use Redirect;
use Response;
use SupergeeksGadgetSwap\GadgetMaker;
use SupergeeksGadgetSwap\Http\Controllers\Controller;
use SupergeeksGadgetSwap\Http\Requests;
use SupergeeksGadgetSwap\Repositories\DevicesRepository;

class DeviceMakerController extends Controller {

    private $deviceRepository;

    public function __construct(DevicesRepository $deviceRepository)
    {
        $this->deviceRepository = $deviceRepository;
//        $this->middleware('auth-adviser',['only'  => ['index','show'] ]);
//        $this->middleware('auth-admin');
    }


    /**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        $q = Input::get('q', null);

        if (!is_null($q)) {
            return GadgetMaker::where('name', 'like', "%$q%")
                ->get();
        }

        if (Input::has('only')) {
            return GadgetMaker::all();
        }

		return $this->deviceRepository->getAllDeviceMakers();
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
        $data = Input::all();

        if(!isset($data['name']))
        {
            return Redirect::back();
        }

        $make = GadgetMaker::create($data);

        if(isset($data['normal_condition'])){
            $make->normal_condition = $data['normal_condition'];
        }

        if(isset($data['scratched_condition'])){
            $make->scratched_condition = $data['scratched_condition'];
        }

        if(isset($data['bad_condition'])){
            $make->bad_condition = $data['bad_condition'];
        }

        $make->save();

        return Redirect::to(\URL::action('Admin\DashboardController@getIndex') . '#/device_brands');
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        return GadgetMaker::destroy($id);
	}

}
