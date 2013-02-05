class Api::SessionsController < Api::BaseApiController
  prepend_before_filter :require_no_authentication, :only => [:create ]
  include Devise::Controllers::InternalHelpers
  
  before_filter :ensure_params_exist
 
  respond_to :json
  
  def create
    build_resource
    resource = User.find_for_database_authentication(:login=>params[:user_login][:login])
		result = resource && resource.valid_for_authentication?(resource.valid_password?(params[:user_login][:password]))
		case result
		when String, Symbol
			return invalid_login_attempt
		when TrueClass
			if !resource.active_for_authentication?
				render :json=> {:success=>false, :message=>resource.inactive_message}, :status=>401
				return
			end
      sign_in("user", resource)
      render :json=> {:success=>true}
      return
		else
			return invalid_login_attempt
		end 
  end
  
  def destroy
    sign_out(resource_name)
  end
 
  def ensure_params_exist
    return unless params[:user_login].blank?
    render :json=>{:success=>false, :message=>"missing user_login parameter"}, :status=>422
  end
 
  def invalid_login_attempt
    warden.custom_failure!
    render :json=> {:success=>false, :message=>"Invalid login or password"}, :status=>401
  end
end