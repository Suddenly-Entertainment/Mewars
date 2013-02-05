class Api::RegistrationsController < Api::BaseApiController
  
  respond_to :json
  def create
 
    user = User.new(params[:user])
    if user.save
      render :json=> {:success=>true}, :status=>201
      return
    else
      warden.custom_failure!
      render :json=> {:success=>false, :error=>user.errors}, :status=>422
    end
  end
end